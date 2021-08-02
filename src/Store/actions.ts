export const POST_QUESTIONS = "POST_QUESTIONS"

export const postQuestionsAction = (payload:Array<any>)=>{
    return {
        type : POST_QUESTIONS,
        payload
    }
}