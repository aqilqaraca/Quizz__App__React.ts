import axios from 'axios'

export class ServiceApi{
    postQuestions(title : string,answer : string,content : string){
        axios.post("https://quizzapp-59f4f-default-rtdb.firebaseio.com/questions.json",{title,answer,content,id : Date.now()})
    }
    getQuestions(){
       return axios.get("https://quizzapp-59f4f-default-rtdb.firebaseio.com/questions.json")
    }
    updateQuestion(questionsKey:string,title : string,answer : string,content : string,id:number){
        axios.patch(`https://quizzapp-59f4f-default-rtdb.firebaseio.com/questions/${questionsKey}.json`,{title,answer,content,id})
    }
    
}