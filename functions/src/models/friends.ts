export interface Friend {
    name: string
    username: string
    imgURL: string
    accountID: string
    since: string
}

export interface FriendRequest{
    fromID: string
    toID: string
    created: string
}
