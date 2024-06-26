import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {CookiesProvider} from "react-cookie";
import {AuthProvider} from "./hooks/authContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <CookiesProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </CookiesProvider>
        </AuthProvider>
    </React.StrictMode>,
)
