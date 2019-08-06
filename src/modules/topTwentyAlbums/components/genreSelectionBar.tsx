import React, { SFC } from "react";

import { $t } from '../../../i18n/i18n.service'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import * as dataModels from '../topTwentyAlbums.dataModels';

interface GenreSelectionBarProps {
    genres: dataModels.ITunesGenre[];
    currentGenre: dataModels.ITunesGenre | null;
    genreSelectedHandler: (genreId: number) => void;
}

const GenreSelectionBar: React.SFC<GenreSelectionBarProps> = (props: GenreSelectionBarProps) =>
<SelectField className="margined-content"
    floatingLabelText={$t.formatMessage({id: 'topTwentyAlbums.genre'})}
    value={props.currentGenre ? props.currentGenre.id : null}
    onChange={(e: React.SyntheticEvent<{}>, index: number, menuItemValue: string) => { props.genreSelectedHandler(parseInt(menuItemValue)) }}
>
    {props.genres.map(genre => <MenuItem value={genre.id} primaryText={genre.title} key={genre.id} />)}
</SelectField>

export default GenreSelectionBar;