import Register from "./components/Register/Register"
import Header from './components/Header/Header'
import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import { Route,Redirect } from "react-router"
import './App.scss'
import Details from "./components/Detail/Details"


export default function App() {
    return (
        <>
            <Header/>
            <Route
                exact
                path="/"
                render={() => {
                    return (
                      <Redirect to="/questions" /> 
                    )
                }}
              />
            <Route path="/questions" component={Home} exact/>
            <Route path="/questions/:id" component={Details}/>
            <Route path="/register" component={Register}/>
            <Route path = "/login" component={Login} />

        </>
    )
}
