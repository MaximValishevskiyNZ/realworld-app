import React, {useContext, useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {HeartOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import ReactMarkdown from "react-markdown";
import './ArticleDetail.css'
import {AuthContext} from "../../hooks/authContext.jsx";
import {Button, message, Popconfirm} from 'antd';
import NewArticle from "../NewArticle/NewArticle.jsx";

export default function ArticleDetail() {
    const {isAuthenticated, user, cookies} = useContext(AuthContext);
    const {slug} = useParams()
    const [article, setArticle] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://blog.kata.academy/api/articles/${slug}`, {
            headers: {
                'Authorization': `Token ${cookies['token-auth']}`,
            }
        })
            .then(response => response.json())
            .then(data => setArticle(data.article))
    }, []);


    useEffect(() => {
        console.log(article)
    }, [article])

    const changeLikes = async (article) => {
        if (isAuthenticated) {
            const method = article.favorited ? 'DELETE' : 'POST'
            const response = await fetch(`https://blog.kata.academy/api/articles/${article.slug}/favorite`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${cookies['token-auth']}`,
                },
                body: JSON.stringify(user),
            });
            const {article: newArticle} = await response.json();
            setArticle(newArticle)
        }
    }

    const confirm = async (e) => {
        console.log(e);
        const response = await fetch(`https://blog.kata.academy/api/articles/${article.slug}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${cookies['token-auth']}`,
            }
        });
        if (response.ok) {
            navigate('/')
        } else {
            message.error('Something went wrong.')
        }


    };
    const cancel = (e) => {
        message.error('Click on No');
    };

    return (
        article && <div className='article rounded'>
            <div className='article__header'>
                <div className='article__header-left'>
                    <div className='article__header-left-top'>
                        <h5 className='article__title'>
                            {article.title}
                        </h5>
                        <button className={`article__header-favourites ${article.favorited ? 'text-red-500' : ''}`}
                                onClick={() => changeLikes(article)}>
                            <HeartOutlined/>
                            {`   ${article.favoritesCount}`}
                        </button>
                    </div>
                    <div className='article__header-left-tags'>
                        {
                            article.tagList.slice(0, 10).map((tag) => (
                                tag ? <div className='tag '>{tag}</div> : ''
                            ))
                        }
                    </div>
                </div>
                <div className='article__header-right'>
                    <div className='article__header-details'>
                        <div className='article__header-author'>{article.author.username}</div>
                        <div
                            className='article__header-created '>{format(article.updatedAt, 'MMMM d, yyyy')}</div>
                    </div>
                    <img className='author-image rounded-full' src={article.author.image}
                         alt="Author Image"/>
                </div>
            </div>
            <div className='article__description-box'>
                <div className='article__description'>
                    <ReactMarkdown>
                        {`${article.description}`}
                    </ReactMarkdown>
                </div>
                {isAuthenticated && user && article && article.author.username === user.username &&
                    <div className='article__buttons'>
                        <Popconfirm
                            title="Are you sure to delete this article?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button className='article__delete rounded'>Delete</Button>
                        </Popconfirm>
                        <div className='article__edit rounded'><Link to={`/articles/${slug}/edit`}>Edit</Link></div>
                    </div>}
            </div>
            <div className='article__body'>
                <ReactMarkdown>
                    {`${article.body}`}
                </ReactMarkdown>
            </div>
        </div>
    )
}