import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import './Header.scss'
import { useEffect } from 'react';
import { useState } from 'react';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);
export default function Header() {
    type userValues = {
        name: string | null;
        email: string | null;
        password: string | null;
        id : string | null;
    };
    const [loginedUser,setLoginedUser] = useState<userValues[]>([])
    const classes = useStyles();
    useEffect(()=>{
        if(localStorage.getItem("username")){
            const user = {
                name : localStorage.getItem("username"),
                email : localStorage.getItem("email"),
                password : localStorage.getItem("password"),
                id : localStorage.getItem("id")
            }
            setLoginedUser([user])
        }
        
    },[])
    const history = useHistory()
    const logout = ()=>{
        setLoginedUser([])
        localStorage.clear()
        history.push("/login")
    }
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    
                    <Typography variant="h6" className={classes.title}>
                        <Link to="/">Quizz App</Link>
                    </Typography>
                    {
                        loginedUser.length > 0 ? <><h5 className="username">{loginedUser[0].name}</h5><h5 onClick={logout} className="logout">Logout</h5></>: (
                            <>
                            <Button color="inherit"><Link to="/register">Register</Link></Button>
                    <Button color="inherit"><Link to="/login">Login</Link></Button>
                            </>
                        )
                    }
                </Toolbar>
            </AppBar>
        </div>
    )
}
