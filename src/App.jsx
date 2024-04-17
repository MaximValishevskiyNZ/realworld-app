import {useContext, useEffect, useState} from 'react'
import './App.css'
import Header from "./components/Header/Header.jsx";
import {Route, Routes} from "react-router-dom";
import ArticlesList from "./components/ArticlesList/ArticlesList.jsx";
import ArticleDetail from "./components/ArticleDetail/ArticleDetail.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import {AuthContext} from "./hooks/authContext.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import EditProfile from "./components/EditProfile/EditProfile.jsx";
import NewArticle from "./components/NewArticle/NewArticle.jsx";
import EditArticle from "./components/EditArticle/EditArticle.jsx";

function App() {
    const [count, setCount] = useState(0)
    const {isAuthenticated} = useContext(AuthContext);


    return (
        <>
            <Header/>
            <div className='app-container'>
                <Routes>
                    <Route path='/'>
                        <Route index element={<ArticlesList/>}></Route>
                        <Route path='/articles' element={<ArticlesList/>}></Route>
                        <Route path='/articles/:slug' element={<ArticleDetail/>}></Route>
                        <Route path='/sign-up' element={<SignUpForm/>}></Route>
                        <Route path='/sign-in' element={<SignInForm/>}></Route>
                        <Route path='/profile' element={<EditProfile/>}></Route>
                        <Route path='/new-article' element={<NewArticle/>}></Route>
                        <Route path='/articles/:slug/edit' element={<EditArticle/>}></Route>
                    </Route>

                </Routes>
            </div>
        </>
    )
}

export default App
