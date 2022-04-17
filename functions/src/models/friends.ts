import { UserAccounts } from "./user"

export interface Friend extends UserAccounts {
    since: string
}

export interface FriendRequest{
    fromID: string
    toID: string
    created: string
}
