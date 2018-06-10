import React, { PureComponent } from "react";

import { Subscription } from 'rxjs/Subscription';

import * as dataModels from './topTwentyAlbums.dataModels';
import * as viewModels from './topTwentyAlbums.viewModels';

import GenreSelectionBar from './components/genreSelectionBar';
import AlbumsList from './components/albumsList';

import * as topTwentyAlbumsService from "./topTwentyAlbums.service";

interface TopTwentyAlbumsState { 
    genres: dataModels.ITunesGenre[];
    currentGenre: dataModels.ITunesGenre;
    albumEntriesList: viewModels.AlbumEntryListItem[];
}

export default class TopTwentyAlbums extends PureComponent<{}, TopTwentyAlbumsState> {

    private subscriptions: Subscription[] = [];

    /* Lifecycle Methods */

    componentWillMount() {
        /* Map Services Subscriptions */

        this.subscriptions.push(topTwentyAlbumsService.genres$.subscribe((genres) => {
                this.setState({genres});
            })
        );

        this.subscriptions.push(topTwentyAlbumsService.currentGenre$.subscribe((currentGenre) => {
                this.setState({currentGenre});
            })
        );

        this.subscriptions.push(topTwentyAlbumsService.albumEntriesList$.subscribe((albumEntriesList) => {
                this.setState({albumEntriesList});
            })
        );

        topTwentyAlbumsService.loadGenreIds();
    }

    componentWillUnmount() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    /* Class Methods */

    loadAlbumEntriesByGenreId(genreId: number) {
        topTwentyAlbumsService.loadAlbumEntriesByGenreId(genreId);
    }

    render() {
        return <div className="top-twenty-albums">
            <GenreSelectionBar 
                genres={this.state.genres} 
                currentGenre={this.state.currentGenre}
                genreSelectedHandler={this.loadAlbumEntriesByGenreId}
            />
            <AlbumsList
                albumEntriesList={this.state.albumEntriesList}
            />
        </div>
    }
}