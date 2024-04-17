import React, {useContext, useEffect, useState} from "react";
import './NewArticle.css'
import {useFieldArray, useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {AuthContext} from "../../hooks/authContext.jsx";
import {useNavigate} from "react-router-dom";

export default function NewArticle() {
    const {isAuthenticated, user, cookies} = useContext(AuthContext);
    const navigate = useNavigate();

    const validationSchema = yup.object({
        title: yup.string().required('Title is required')
            .min(5, 'Title must be at least 5 characters')
            .max(200, 'Title must be at most 200 characters'),
        description: yup.string().required('Description is required')
            .min(5, 'Description must be at least 5 characters')
            .max(200, 'Description must be at most 200 characters'),
        body: yup.string().required('Text is required')
            .min(10, 'Text must be at least 10 characters'),
        tags: yup.array().of(yup.object({
            value: yup.string().required('Tag value is required')
                .min(1, 'Tag value must be at least 1 character')
        }))
    });

    const {register, handleSubmit, control, formState: { errors }, setValue} = useForm({
        resolver: yupResolver(validationSchema),
    });




    const {fields, append, remove} = useFieldArray({
        control,
        name: "tags"
    });

    const onSubmit = async (data) => {

        const body = {
            article: {...data, tagList: [...data.tags.map((tag) => tag.value.toString())]}
        }
        console.log(body)
        const response = await fetch('https://blog.kata.academy/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['token-auth']}`,
            },
            body: JSON.stringify(body),
        });
        if (response.ok) {
            navigate('/')
        } else {
            alert('Server error.')
        }
    }

    return (
        <div className="article-form__container">
            <div className="sign-up__title">Create new article</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="title" className="form-label">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    className='form-input'
                    placeholder="Title"
                    aria-label="Title"
                    {...register('title')}
                />
                {errors.title && <div className="sign-up__error">{errors.title.message}</div>}
                <label htmlFor="description" className="form-label">
                    Title
                </label>
                <input
                    type="text"
                    id="description"
                    className='form-input'
                    placeholder="Short description"
                    aria-label="Short description"
                    {...register('description')}
                />
                {errors.description && <div className="sign-up__error">{errors.description.message}</div>}
                <label htmlFor="text" className="form-label">
                    Text
                </label>
                <textarea
                    id="text"
                    className='form-input'
                    placeholder="Text"
                    rows='5'
                    aria-label="Text"
                    {...register('body')}
                />
                {errors.body && <div className="sign-up__error">{errors.body.message}</div>}
                <div className="form-label">
                    Tags
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className='tag-container'>
                        <div className='tag-input-container'>
                            <input
                                type="text"
                                className='form-input w-[300px]'
                                placeholder="Tag"
                                aria-label="Tag"
                                {...register(`tags.${index}.value`)}
                                defaultValue={field.value}
                            />
                            { errors.tags && errors.tags[index] && <div className="sign-up__error">{errors.tags[index].value.message}</div>}
                        </div>
                        <button type="button" className='delete-btn rounded' onClick={() => remove(index)}>Remove</button>
                        { fields.length === index + 1 && <button type="button" className='add-btn rounded' onClick={() => append({value: ''})}>Add Tag</button>}
                    </div>
                ))}
                { fields.length === 0 && <button type="button" className='add-btn rounded block' onClick={() => append({value: ''})}>Add Tag</button>}
                <button className='sign-up__confirm rounded w-[319px] mt-[20px]' type='submit'>Send</button>
            </form>
        </div>

    )
}