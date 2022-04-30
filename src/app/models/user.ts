import { Track } from "./spotify";

export interface UserAccounts{
    userId: string,
    firstName: string,
    lastName: string,
    dob: string,
    accountName: string,
    email: string,
    imageURL?: string,
    status?: "offline" | "online" | "away",
    currentlyListening?: Track
}