import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { ServiceApi } from '../../Service';
import axios from 'axios';
import './Details.scss'
import CloseIcon from '@material-ui/icons/Close';



const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    qContent: {
        margin: "20px 0"
    },
    pos: {
        marginBottom: 12,
    },
    answer: {
        margin: "20px 0"
    }

});
const useStyles2 = makeStyles((theme) => ({
    table: {
        minWidth: 500,

    },
    addQuestion: {
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing(3),
    }
}));

export default function Details() {
    interface ID {
        id: string
    }
    const classes = useStyles();
    const { id } = useParams<ID>()
    


    const [rows, setRows] = useState<any[]>([])
    useEffect(() => {

        new ServiceApi().getQuestions().then(response => {
            let arr: any[] = []
            for (let key in response.data) {

                let a = {
                    key,
                    data: response.data[key]
                }
                if (a.data.id === parseInt(id)) {
                    arr.push(a)
                }


            }
            setRows(arr);

        })

    }, [])
    const history = useHistory()
    const deleteQuestions = (questionKey: string) => {
        axios.delete(`https://quizzapp-59f4f-default-rtdb.firebaseio.com/questions/${questionKey}.json`)
        setTimeout(() => {
            history.push("/")
        }, 300)
    }
    const classes2 = useStyles2();


    const [update, setUpdate] = useState(false)
    const [title, setTitle] = useState("")
    const [content, setContet] = useState("")
    const [answer, setAnswer] = useState("")

    const updateData = (questionKey:string) => {
        const questionid = parseInt(id)
        new ServiceApi().updateQuestion(questionKey,title, answer, content,questionid)
        setTitle("")
        setContet("")
        setAnswer("")
    }
    const close = () => {
        setUpdate(false)
        setTimeout(()=>{
            window.location.reload()
        },100)

    }

    const [loginedUser,setLoginedUser] = useState<string | null>("")
    useEffect(()=>{
        if(localStorage.getItem("username")){
            setLoginedUser(localStorage.getItem("username"))
            
        }
        
    },[])
    const [addAnswer,setAddAnswer] = useState<boolean>(false)
    const [answerText,setAnswerText] = useState<string>("")
    const answerQuestion = (questionId:string)=>{
        axios.post("https://quizzapp-59f4f-default-rtdb.firebaseio.com/answerslist.json",{name : loginedUser, questionId,answer : answerText,userId:localStorage.getItem("id")})
        setTimeout(()=>{
            window.location.reload()
        },300)
    }
    const [usersAnswer,setUsersAnswer] = useState<any[]>([])
    useEffect(()=>{
        axios.get("https://quizzapp-59f4f-default-rtdb.firebaseio.com/answerslist.json").then(response=>{
            for(let key in response.data){
                setUsersAnswer(oldArray => [...oldArray, response.data[key]]);
            }
        })
        
        
    },[])
    return (
        <div className="container mt-4">
            <Card className={classes.root}>

                <CardContent>
                    {
                        rows.filter(item => item.data.id === parseInt(id)).map(item => (
                            <div key={item.data.id}>
                                {
                                    !update && <div className="details__box" >
                                    <Typography variant="h5" component="h2">
                                        Question Title : {item.data.title}
                                    </Typography>

                                    <Typography variant="body2" className={classes.qContent} component="p">
                                        Question Content : {item.data.content}
                                    </Typography>
                                    <Typography style={{display:'flex'}} variant="body2" className={classes.qContent} component="p">
                                       {!loginedUser && `Question answer : ${item.data.answer}`}
                                       {
                                           usersAnswer.filter(asnwerX=>asnwerX.userId === localStorage.getItem("id") && asnwerX.questionId === item.data.id).map(item=>(
                                               `My answer : ${item.answer}`
                                           ))
                                       }
                                    
                                    {
                                        addAnswer && <form className="add__answer" noValidate autoComplete="off">
                                        <TextField value={answerText} onChange={(e)=>setAnswerText(e.target.value)} id="outlined-basic" variant="outlined" />
                                        <Button onClick={()=>answerQuestion(item.data.id)} variant="contained" color="primary">
                                            Add
                                        </Button>
                                    </form>
                                    }
                                    </Typography>
                                    <div className="buttons__box">
                                        {loginedUser && <div>
                                            <Button onClick={()=>setAddAnswer(!addAnswer)} style={{marginRight: "20px"}} variant="contained" color="primary">
                                            Add answer
                                        </Button></div> }
                                        {
                                            !loginedUser && <Button onClick={() => setUpdate(true)} variant="contained" color="primary">
                                            Update
                                        </Button>
                                        }
                                        {!loginedUser && <Button onClick={() => deleteQuestions(item.key)} variant="contained" style={{ backgroundColor: "#dc3545", color: "white", margin: "0 20px" }}>
                                            Delete
                                        </Button>}
                                    </div>
                                </div>
                                }
                                {
                                    update && <div className=" d-center">

                                    <div className="add__question__box d-center">

                                        <form className={classes2.addQuestion} noValidate autoComplete="off">
                                            <div className="close" onClick={close}><CloseIcon /></div>
                                            <TextField value = {title} onChange={(e) => setTitle(e.target.value)} id="outlined-basic" label={item.data.title} variant="outlined" />
                                            <TextField value={content} onChange={(e) => setContet(e.target.value)} id="outlined-basic" label={item.data.content} variant="outlined" />
                                            <TextField value={answer} onChange={(e) => setAnswer(e.target.value)} id="outlined-basic" label={item.data.answer} variant="outlined" />
                                            <Button onClick={()=>updateData(item.key)} variant="contained" color="primary">
                                                Update
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                                }
                                {
                                    !loginedUser && 
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        Answer
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {usersAnswer.filter(item=>parseInt(item.questionId) === parseInt(id)).map(item=>(
                                                <TableRow key={item.userId}>
                                                    <TableCell>
                                                        {item.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.answer}
                                                    </TableCell>
                                                </TableRow>            
                                            ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                }
                            </div>
                        ))
                    }
                </CardContent>
            </Card>
        </div>
    );
}