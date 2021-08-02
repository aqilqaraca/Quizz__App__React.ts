import { POST_QUESTIONS } from "./actions"
const initialValues = {
    questions : []
}

export const questionsReducer = (state = initialValues,action:any)=>{
    switch(action.type){
        case POST_QUESTIONS : 
            return {...state,questions : state = action.payload}
        default : 
            return state    
    }
}