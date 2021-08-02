
import { render } from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Store/config";

const root = document.querySelector("#root")
render( <Provider store={store}><Router><App/></Router></Provider> , root)