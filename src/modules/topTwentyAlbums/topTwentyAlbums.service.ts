import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/distinctUntilChanged';

import keyBy from 'lodash/keyBy';
import flow from 'lodash/flow';
import values from 'lodash/values';
import sortBy from 'lodash/sortBy';

import * as iTunesService from "./services/iTunes.service";

import * as dataModels from './topTwentyAlbums.dataModels';

import * as viewModels from './topTwentyAlbums.viewModels';

import * as utils from './topTwentyAlbums.utils';

import { parsedHash$ } from '../../shared/services/route.service';

/* Local Storage Definitions, Methods and Init. */

const LOCAL_STORAGE_KEY: string = 'topTwentyAlbums';

interface localStorageObjModel {
    currentGenreId: number | null;
}

const _localStorageObj: localStorageObjModel = parseLocalStorageObj(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');

function parseLocalStorageObj(localStorageItem: string) {
    const parsedLocalStorageObj: any = JSON.parse(localStorageItem);
    return <localStorageObjModel>{
        currentGenreId: parseInt(parsedLocalStorageObj.currentGenreId, 10)
    }
}

/* Private State BehaviorSubjects */

const _genresMap$: BehaviorSubject<dataModels.ITunesGenresMap> = new BehaviorSubject<dataModels.ITunesGenresMap>({});
const _albumEntries$: BehaviorSubject<dataModels.ITunesAlbumEntry[]> = new BehaviorSubject<dataModels.ITunesAlbumEntry[]>([]);
const _currentGenreId$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(_localStorageObj.currentGenreId || null);

/* Effects-triggering Subjects */

const _genresToLoad$: Subject<null> = new Subject<null>();
const _albumEntriesToLoadByGenreId$: Subject<number> = new Subject<number>();

/* Methods */

export function setCurrentGenreId(genreId: number) {
    _currentGenreId$.next(genreId);
}

export function loadGenresIds(): void {
    _genresToLoad$.next();
}

export function loadAlbumEntriesByGenreId(genreId: number): void {
    _albumEntriesToLoadByGenreId$.next(genreId);
}

/* Effects */

const _genresToLoadSubscription$: Subscription = _genresToLoad$.switchMap(() => iTunesService.getGenres())
    .withLatestFrom(parsedHash$)
    .subscribe(([genres, parsedHash]: [dataModels.ITunesGenre[], string[]]) => {
        const genresMap = keyBy(genres, 'id');
        _genresMap$.next(genresMap);

        const hashGenreId: number | null = parsedHash.length ? parseInt(parsedHash[parsedHash.length - 1]) : null;
        let curGenreId: number = (genresMap[hashGenreId || 0] && hashGenreId)
            || _localStorageObj.currentGenreId || genres[0].id;

        //loading genre ids is always followed by loading the selected genre albums list
        loadAlbumEntriesByGenreId(curGenreId);
    });

const _albumEntriesToLoadByGenreIdSubscription$: Subscription = _albumEntriesToLoadByGenreId$
    .distinctUntilChanged()
    .switchMap((genreId: number) => {
        _currentGenreId$.next(genreId);
        return iTunesService.getTopTwentyAlbumsByGenreId(genreId);
    }).subscribe((albumEntries: dataModels.ITunesAlbumEntry[]) => {
        _albumEntries$.next(albumEntries);
    });

/* Subscriptions */

const _parsedHashSubscription$: Subscription = parsedHash$
    .withLatestFrom(_genresMap$)
    .map(([parsedHash, genresMap]: [string[], dataModels.ITunesGenresMap]): number | null => { // handle only valid top-twenty urls
        if (!genresMap || !Object.keys(genresMap).length) return null;

        const parsedHashGenreId = utils.getParsedHashGenreId(parsedHash);

        if (!parsedHashGenreId || !genresMap[parsedHashGenreId]) return null;

        return parsedHashGenreId;
    })
    .filter((genreId: number | null) => !!genreId)
    .subscribe((genreId: number | null) => {
        if (genreId) loadAlbumEntriesByGenreId(genreId);
    });

/* Public Selectors */

export const genres$: Observable<dataModels.ITunesGenre[]> = _genresMap$.map(genresMap => {
    if (!genresMap || !Object.keys(genresMap).length) return [];

    return flow([
        values,
        (genresArr: dataModels.ITunesGenre[]) => sortBy(genresArr, 'title')
    ])(genresMap);
});

export const currentGenre$: Observable<dataModels.ITunesGenre | null> = _currentGenreId$.withLatestFrom(_genresMap$, (currentGenreId, genresMap) => {
    if (!currentGenreId || !genresMap || !Object.keys(genresMap).length) return null;

    return genresMap[currentGenreId];
});

export const albumEntriesList$: Observable<viewModels.AlbumEntryListItem[]> = _albumEntries$.map((albumEntries) => {
    return utils.mapToListAlbumEntries(albumEntries);
});

/* Local Storage Subscription */

combineLatest(_currentGenreId$).subscribe(([currentGenreId]) => {
    _localStorageObj.currentGenreId = currentGenreId;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(_localStorageObj));
});

