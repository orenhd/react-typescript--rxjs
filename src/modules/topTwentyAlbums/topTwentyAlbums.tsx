import React, { PureComponent } from "react";
import { withRouter, RouteComponentProps } from "react-router";

import { Subscription } from 'rxjs/Subscription';

import * as dataModels from './topTwentyAlbums.dataModels';
import * as viewModels from './topTwentyAlbums.viewModels';

import GenreSelectionBar from './components/genreSelectionBar';
import AlbumsList from './components/albumsList';

import * as topTwentyAlbumsService from "./topTwentyAlbums.service";

import { MODULE_ROUTE } from './topTwentyAlbums.consts';

interface TopTwentyAlbumsState {
    genres: dataModels.ITunesGenre[];
    currentGenre: dataModels.ITunesGenre | null;
    albumEntriesList: viewModels.AlbumEntryListItem[];
}

interface TopTwentyAlbumsProps extends RouteComponentProps<{}> {
    match: any;
    history: any;
}

class TopTwentyAlbums extends PureComponent<TopTwentyAlbumsProps, TopTwentyAlbumsState> {

    state: TopTwentyAlbumsState = {
        genres: [],
        currentGenre: null,
        albumEntriesList: []
    }
    private subscriptions: Subscription[] = [];

    /* Lifecycle Methods */

    componentDidMount() {
        /* Map Services Subscriptions */

        this.subscriptions.push(topTwentyAlbumsService.genres$.subscribe((genres) => {
            this.setState({ genres })
        }),
            topTwentyAlbumsService.currentGenre$.subscribe((currentGenre) => {
                this.setState({ currentGenre });
            }),
            topTwentyAlbumsService.albumEntriesList$.subscribe((albumEntriesList) => {
                this.setState({ albumEntriesList });
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

    navigateToSelectedGenreId = (genreId: number) => {
        const { currentGenre } = this.state;

        if (!currentGenre || currentGenre.id !== genreId) {
            this.props.history.push(`/${MODULE_ROUTE}/${genreId}`);
        }
    }

    render() {
        const { genres, currentGenre, albumEntriesList } = this.state;
        return <div className="top-twenty-albums">
            <GenreSelectionBar
                genres={genres}
                currentGenre={currentGenre}
                genreSelectedHandler={this.navigateToSelectedGenreId}
            />
            <AlbumsList
                albumEntriesList={albumEntriesList}
            />
        </div>
    }
}

export default withRouter(TopTwentyAlbums);