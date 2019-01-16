import React, { PureComponent } from "react";
import { withRouter, RouteComponentProps } from "react-router";

import { connect, SelectorsMap, MethodsMap } from '../../shared/connectToServices';

import * as dataModels from './topTwentyAlbums.dataModels';
import * as viewModels from './topTwentyAlbums.viewModels';

import GenreSelectionBar from './components/genreSelectionBar';
import AlbumsList from './components/albumsList';

import * as topTwentyAlbumsService from "./topTwentyAlbums.service";

import { MODULE_ROUTE } from './topTwentyAlbums.consts';

interface TopTwentyAlbumsProps extends RouteComponentProps<{}> {
    genres: dataModels.ITunesGenre[];
    currentGenre: dataModels.ITunesGenre | null;
    albumEntriesList: viewModels.AlbumEntryListItem[];
    loadGenresIds: Function;
    match: any;
    history: any;
}

export class TopTwentyAlbums extends PureComponent<TopTwentyAlbumsProps, {}> { // export disconnected class for testing purposes

    /* Lifecycle Methods */

    componentDidMount() {
        this.props.loadGenresIds();
    }

    /* Class Methods */

    navigateToSelectedGenreId = (genreId: number) => {
        const { currentGenre } = this.props;

        if (!currentGenre || currentGenre.id !== genreId) {
            this.props.history.push(`/${MODULE_ROUTE}/${genreId}`);
        }
    }

    render() {
        const { genres, currentGenre, albumEntriesList } = this.props;
        return <div className="top-twenty-albums">
            { genres && <GenreSelectionBar
                genres={genres}
                currentGenre={currentGenre}
                genreSelectedHandler={this.navigateToSelectedGenreId}
            />}
            { albumEntriesList && <AlbumsList
                albumEntriesList={albumEntriesList}
            />}
        </div>
    }
}

const mapSelectorsToProps: SelectorsMap = {
    genres: topTwentyAlbumsService.genres$,
    currentGenre: topTwentyAlbumsService.currentGenre$,
    albumEntriesList: topTwentyAlbumsService.albumEntriesList$,
}

const mapMethodsToProps: MethodsMap = {
    loadGenresIds: topTwentyAlbumsService.loadGenresIds
}

export default connect(mapSelectorsToProps, mapMethodsToProps)(withRouter(TopTwentyAlbums));