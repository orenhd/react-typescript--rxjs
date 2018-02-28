import * as React from "react";

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import * as viewModels from '../topTwentyAlbums.viewModels';

interface AlbumsListProps {
    albumEntriesList: viewModels.AlbumEntryListItem[];
}

const AlbumsList: React.SFC<AlbumsListProps> = (props: AlbumsListProps) =>
<List>
    {props.albumEntriesList.map(albumEntry => 
        <ListItem
        key={albumEntry.id}
        leftAvatar={<Avatar src={albumEntry.thumbnail} />}
        primaryText={albumEntry.title}
        secondaryText={
            <p>
            <span>{albumEntry.artist}</span>
                <br />
            <span>{albumEntry.copyright}</span>
            </p>
        }
        secondaryTextLines={2}
        style={{pointerEvents: 'none'}}
        />
    )}
</List>

export default AlbumsList;