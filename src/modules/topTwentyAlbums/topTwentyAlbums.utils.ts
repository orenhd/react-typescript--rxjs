import * as dataModels from './topTwentyAlbums.dataModels';
import * as viewModels from './topTwentyAlbums.viewModels';

import { MODULE_ROUTE } from './topTwentyAlbums.consts';

export function mapToListAlbumEntries(albumEntries: dataModels.ITunesAlbumEntry[]): viewModels.AlbumEntryListItem[] {
    return albumEntries.map((albumEntry: dataModels.ITunesAlbumEntry) => {
        return {
            id: albumEntry.id.label,
            title: albumEntry['im:name'].label,
            artist: albumEntry['im:artist'].label,
            copyright: albumEntry['rights'].label,
            thumbnail: (<any> albumEntry['im:image'][0]).label
        }
    });
}

export function getParsedHashGenreId(parsedHash: string []): number | null {
    if (!parsedHash || parsedHash.length < 2) return null;

    if (parsedHash[parsedHash.length -2] !== MODULE_ROUTE) return null;

    const parsedHashGenreId: number = parseInt(parsedHash[parsedHash.length - 1]);

    if (!parsedHashGenreId || parsedHashGenreId === NaN) return null;

    return parsedHashGenreId;
}