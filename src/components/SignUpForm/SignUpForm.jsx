import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {Link, useNavigate} from 'react-router-dom';
import './SignUpForm.css';
import { useCookies } from 'react-cookie';

export default function SignUpForm(date, values) {
    const navigate = useNavigate();
    const [cookies, setCookies] = useCookies(['token-auth'])

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be at most 20 characters')
            .required('Username is required'),
        email: Yup.string()
            .email('Email is not valid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must be at most 40 characters')
            .required('Password is required'),
        passwordRepeat: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Repeat password is required'),
        termsCheckbox: Yup.boolean()
            .oneOf([true], 'You must agree to the terms and conditions')
            .required('You must agree to the terms and conditions'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError, // Add setError here
    } = useForm({
        resolver: yupResolver(validationSchema),
    });


    const onSubmit = async (data) => {
        const user = {
            user: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        };

        const response = await fetch('https://blog.kata.academy/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (!response.ok) {
            const { errors } = await response.json();
            // Assuming errors from the server are in a format that can be directly mapped to form fields
            // If not, you might need to adjust this mapping
            Object.entries(errors).forEach(([key, value]) => {
                setError(key, { type: 'manual', message: value });
            });
        } else {
            const { user: {token} } = await response.json();
            setCookies('token-auth', token);
            navigate('/');
        }
    };


    return (
        <div className="sign-up__container rounded">
            <div className="sign-up__title">Create new account</div>
            <form className="sign-up__form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="username" className="form-label">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    className={`form-input ${errors.username ? 'red' : ''}`}
                    {...register('username')}
                    placeholder="Username"
                    aria-label="Username"
                />
                {errors.username && <div className="sign-up__error">{errors.username.message}</div>}

                <label htmlFor="email" className="form-label">
                    Email address
                </label>
                <input
                    type="email"
                    id="email"
                    className={`form-input ${errors.email ? 'red' : ''}`}
                    {...register('email')}
                    placeholder="Email address"
                    aria-label="Email address"
                />
                {errors.email && <div className="sign-up__error">{errors.email.message}</div>}

                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    className={`form-input ${errors.password ? 'red' : ''}`}
                    {...register('password')}
                    placeholder="Password"
                    aria-label="Password"
                />
                {errors.password && <div className="sign-up__error">{errors.password.message}</div>}

                <label htmlFor="repeat-password" className="form-label">
                    Repeat Password
                </label>
                <input
                    type="password"
                    id="passwordRepeat"
                    className={`form-input ${errors.passwordRepeat ? 'red' : ''}`}
                    {...register('passwordRepeat')}
                    placeholder="Repeat Password"
                    aria-label="Repeat Password"
                />
                {errors.passwordRepeat && <div className="sign-up__error">{errors.passwordRepeat.message}</div>}

                <div className="terms-agreement">
                    <input
                        type="checkbox"
                        id="terms-checkbox"
                        className="terms-checkbox"
                        {...register('termsCheckbox')}
                        aria-label="Agree to terms checkbox"
                    />
                    <label htmlFor="terms-checkbox" className="terms-text">
                        I agree to the processing of my personal <br /> information
                    </label>
                </div>
                {errors.termsCheckbox && <div className="sign-up__error">{errors.termsCheckbox.message}</div>}

                <button type="submit" className="sign-up__confirm rounded">
                    Create
                </button>
                <div className='form__reroute'>Already have an account?  &nbsp;<Link className='text-blue-600' to='/sign-in'>Sign In.</Link></div>
            </form>
        </div>
    );
}