import { Friend } from "./friends";

export interface UserAccounts{
    userId: string,
    firstName: string,
    lastName: string,
    dob: string,
    accountName: string,
    email: string,
    imageURL?: string,
    friends?: Friend[]
}