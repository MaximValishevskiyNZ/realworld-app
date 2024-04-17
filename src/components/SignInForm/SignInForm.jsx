import React, {useContext, useState} from "react";
import {useForm} from "react-hook-form";
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../../hooks/authContext.jsx";
import './SignInForm.css'


export default function SignInForm() {
    const { setCookies } = useContext(AuthContext);
    const navigate = useNavigate();
    const [wrongLogin, setWrongLogin] = useState(false)
    const validationSchema = yup.object().shape({
        email: yup.string().email('Введите корректный email').required('Email обязателен'),
        password: yup.string().required('Пароль обязателен'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    async function onSubmit(data) {
        setWrongLogin(false)
        const user = {
            user: {
                email: data.email,
                password: data.password,
            },
        };

        const response = await fetch('https://blog.kata.academy/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
           setWrongLogin(true)
        } else {
            const { user: {token} } = await response.json();
            setCookies('token-auth', token);
            navigate('/');
        }
    }

    return (
        <div className="sign-up__container rounded">
            <div className="sign-up__title">Log in account</div>
            <div>{wrongLogin && 'Wrong email or password. Please, try again.'}</div>
            <form className="sign-up__form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email" className="form-label">
                    Email address
                </label>
                <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'red' : ''}`}
                    placeholder="Email address"
                    aria-label="Email address"
                    {...register('email')}
                />
                {errors.email && <div className="sign-up__error">{errors.email.message}</div>}
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    className={`form-input ${errors.password ? 'red' : ''}`}
                    placeholder="Password"
                    aria-label="Password"
                    {...register('password')}
                />
                {errors.password && <div className="sign-up__error">{errors.password.message}</div>}
                <button type="submit" className="sign-up__confirm rounded">
                    Create
                </button>
                <div className='form__reroute'>Don’t have an account? &nbsp;<Link className='text-blue-600' to='/sign-up'>Sign Up.</Link></div>
            </form>
        </div>
    );
}