export interface SpotifyGrant{
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token?: string,
    scope: string
}

export interface Track{
    id: string,
    name: string,
    uri: string,
    duration_ms: number,
    artists: Artist[],
    album: Album 
}

export interface Artist{
    id: string,
    name: string,
    uri: string,
}

export interface Album{
    artists: Artist[],
    id: string,
    images: AlbumImages[],
    name: string,
    release_date: string,
    uri: string
}

export interface AlbumImages{
    url: string,
}