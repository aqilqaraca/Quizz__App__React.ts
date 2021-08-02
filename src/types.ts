export interface Answer{
    aContent : string,
    vote_score : number,
    user : string
}

export interface Question{
    id : number,
    title : string,
    qContent : string,
    Answers : Array<Answer>,
    user : string
}