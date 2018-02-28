import * as React from "react";

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
    subscriptions: Subscription[];
}

export default class TopTwentyAlbums extends React.Component<{}, TopTwentyAlbumsState> {

    /* Lifecycle Methods */

    componentWillMount() {
        let subscriptions: Subscription[] = [];

        /* Map Services Subscriptions */

        subscriptions.push(topTwentyAlbumsService.genres$.subscribe((genres) => {
                this.setState({genres});
            })
        );

        subscriptions.push(topTwentyAlbumsService.currentGenre$.subscribe((currentGenre) => {
                this.setState({currentGenre});
            })
        );

        subscriptions.push(topTwentyAlbumsService.albumEntriesList$.subscribe((albumEntriesList) => {
                this.setState({albumEntriesList});
            })
        );

        this.setState({subscriptions});

        topTwentyAlbumsService.loadGenreIds();
    }

    componentWillUnmount() {
        this.state.subscriptions.forEach((subscription) => {
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