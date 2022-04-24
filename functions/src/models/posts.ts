export interface Posts{
    userID: string,
    userAccountName: string,
    userAccountPic?: string,
    imageURL?: string,
    caption: string,
    public: boolean,
    dateCreated?: Date,
    postID?: string
}