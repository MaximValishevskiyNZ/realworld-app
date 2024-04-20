import React, {useContext} from 'react';
import './Header.css'
import {Link} from "react-router-dom";
import {AuthContext} from "../../hooks/authContext.jsx";
import {Button} from "antd";
export default function Header() {
    const {isAuthenticated, removeCookies, cookies, user} = useContext(AuthContext);
    return (
        <header className="header">
            <h1 className="header__title"><Link to='/'>Realworld blog</Link></h1>
            <div className='title__buttons'>
                { isAuthenticated ?
                    <>
                        <div className='create-article  px-[5px] py-[2px] rounded'><Link to='/new-article'>Create article</Link></div>
                        { user && <Link className='profile-link' to='/profile'>{user.username}
                            <img className='author-image rounded-full' src={user.image} alt="User Image"/>
                        </Link>}
                        <Button className='h-[51px] w-[109px] border-black' onClick={() => removeCookies('token-auth')}>Log Out</Button>
                    </>
                    :
                    <>
                        <div><Link to='/sign-in'>Sign In</Link></div>
                        <div><Link to='/sign-up'>Sign Up</Link></div>
                    </> }
            </div>
        </header>
    )
}