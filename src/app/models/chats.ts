export interface Chat{
    users: string[] /*Array of user ids who are connected to the chat*/
    chatId?: string
    chatName: string
}

export interface Message{
    userId: string
    timestamp?: Date
    content: string
}