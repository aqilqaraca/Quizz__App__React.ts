import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Login.scss'
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(3),
            width: '50ch',
            display: 'flex'
        },
    },
}));

export default function Login() {
    type FormValues = {
        email: string;
        password: string;
    };
    type userValues = {
        name: string;
        email: string;
        password: string;
        id : number
    };
    const[userss,setUserss] = useState<userValues[]>([])
    const classes = useStyles();
    useEffect(()=>{
        let users : any[] = []
        axios.get("https://quizzapp-59f4f-default-rtdb.firebaseio.com/users.json").then(response=>{
            
            for(let key in response.data){
                users.push(response.data[key])
            }
        })
        setUserss(users)
    },[])
    const history = useHistory()
    const { register,formState: { errors }, handleSubmit } = useForm()
    const onSubmit: SubmitHandler<FormValues> = data => {
        const loginUser = userss.filter(item=>item.email === data.email && item.password === data.password)
        console.log(loginUser)
        if(loginUser.length>0){
            toast.success("The account was successfully logged in")
            localStorage.setItem("username",loginUser[0].name)
            localStorage.setItem("email",loginUser[0].email)
            localStorage.setItem("id",String(loginUser[0].id))
            localStorage.setItem("password",loginUser[0].password)
            setTimeout(()=>{
                history.push("/")
                window.location.reload()
            },2000)

            
        }
        else if(loginUser.length<=0){
            toast.error("Email or password is incorrect")
        }
    }
    
    return (
        <>
        <ToastContainer/>
        <div className="container">
            <div className="register__box d-center">
                <form onSubmit={handleSubmit(onSubmit)} className={classes.root} noValidate autoComplete="off">
                    <TextField id="outlined-basic" error={errors.email} helperText={errors.email ? "the email must contain an @ sign" : ""} label="Email" variant="outlined" {...register("email",{pattern : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})}/>
                    <TextField id="outlined-basic" label="Password" variant="outlined" {...register("password")}/>
                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </form>
            </div>
        </div>
        </>
    )
}
