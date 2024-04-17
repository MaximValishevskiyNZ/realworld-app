import './EditProfile.css'
import React, {useContext, useEffect} from "react";
import {AuthContext} from "../../hooks/authContext.jsx";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";

export default function EditProfile() {
    const {isAuthenticated, user, cookies} = useContext(AuthContext);
    const navigate = useNavigate();


    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, 'Username must be at least 3 characters')
            .max(20, 'Username must be at most 20 characters'),
        email: Yup.string()
            .email('Email is not valid'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .max(40, 'Password must be at most 40 characters'),
        image: Yup.string()
            .url('Avatar image must be a valid URL')
    });



    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/sign-in')
        }
    }, [isAuthenticated]);

    useEffect(() => {
        console.log(user)
    }, [user]);

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
                image: data.image
            },
        };

        const response = await fetch('https://blog.kata.academy/api/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['token-auth']}`,
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
            alert('Data updated successfully.')
        }
    };


    return (
        <div className="sign-up__container rounded">
            <div className="sign-up__title">Edit Profile</div>
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
                    defaultValue={user.username}
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
                    defaultValue={user.email}
                />
                {errors.email && <div className="sign-up__error">{errors.email.message}</div>}
                <label htmlFor="password" className="form-label">
                    New Password
                </label>
                <input
                    type="password"
                    id="password"
                    className={`form-input ${errors.password ? 'red' : ''}`}
                    {...register('password')}
                    placeholder="New Password"
                    aria-label="New Password"
                />
                {errors.password && <div className="sign-up__error">{errors.password.message}</div>}
                <label htmlFor="password" className="form-label">
                    Avatar image (url)
                </label>
                <input
                    type="text"
                    id="image"
                    className={`form-input ${errors.image ? 'red' : ''}`}
                    {...register('image')}
                    placeholder="Avatar image"
                    aria-label="Avatar image"
                    defaultValue={user.image}
                />
                {errors.image && <div className="sign-up__error">{errors.image.message}</div>}
                <button type="submit" className="sign-up__confirm rounded">
                    Save
                </button>
            </form>
        </div>
    )
}