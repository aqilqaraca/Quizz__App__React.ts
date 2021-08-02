import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Register.scss'
import { useForm, SubmitHandler } from "react-hook-form";
import axios from 'axios';
import { ErrorMessage } from '@hookform/error-message';
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

export default function Register() {

    type FormValues = {
        name: string;
        email: string;
        password: string;
    };
    const classes = useStyles();
    const history = useHistory()
    const { register, formState: { errors }, handleSubmit } = useForm()
    type userValues = {
        name: string;
        email: string;
        password: string;
        id : number
    };
    const[userss,setUserss] = useState<userValues[]>([])
    useEffect(()=>{
        let users : any[] = []
        axios.get("https://quizzapp-59f4f-default-rtdb.firebaseio.com/users.json").then(response=>{
            
            for(let key in response.data){
                users.push(response.data[key])
            }
        })
        setUserss(users)
    },[])
    const onSubmit: SubmitHandler<FormValues> = data => {
        const activeUser = userss.filter(item=>item.email===data.email)
        if(activeUser.length >0){
            toast.error("An account has already been opened with this email")
            return
        }
        if (!errors.email && !errors.name && !errors.password) {
            axios.post("https://quizzapp-59f4f-default-rtdb.firebaseio.com/users.json", { ...data, id: Date.now() })
            toast.success("Registration completed successfully.")
            toast.warning("you will be redirected to the login page.")
            setTimeout(()=>{
                history.push("/login")
            },4000)
        }   
    };
    
    return (
        <>
        <ToastContainer />
        <div className="container">
            <div className="register__box d-center">
                <form onSubmit={handleSubmit(onSubmit)} className={classes.root} noValidate autoComplete="off">
                    <TextField id="outlined-basic" error={errors.name} helperText={errors.name ? "name is required and the length must be at least 3" : ""} label="Name" variant="outlined" {...register("name", { required: "name is required.", minLength: 3 })} />

                    <TextField id="outlined-basic" error={errors.email} helperText={errors.email ? "email is required , the length must be at least 10" : ""} label="Email" variant="outlined" {...register("email", { required: "email is required.", minLength: 10, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "the email must contain an @ sign" } })} />
                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({ message }) => <p>{message}</p>}
                    />
                    <TextField id="outlined-basic" error={errors.password} helperText={errors.password ? "password is required and the length must be at least 5" : ""} label="Password" variant="outlined" {...register("password", { required: "email is required.", minLength: 5 })} />

                    <Button type="submit" variant="contained" color="primary">
                        Register
                    </Button>
                </form>
            </div>
        </div>
        </>
    )
}
