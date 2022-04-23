export interface Posts{
    userID: string,
    userAccountName: string,
    imageFile?: File,
    imageURL?: string,
    caption: string,
    public: boolean,
    dateCreated?: Date,
    postID?: string
}