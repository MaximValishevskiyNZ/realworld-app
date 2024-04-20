import React, {useContext, useEffect, useState} from "react";
import './ArticlesList.css'
import {HeartOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import {Pagination, Spin} from "antd";
import * as PropTypes from "prop-types";
import ReactMarkdown from 'react-markdown';
import {Link} from "react-router-dom";
import {AuthContext} from "../../hooks/authContext.jsx";


ReactMarkdown.propTypes = {children: PropTypes.node};
export default function ArticlesList() {
    const [articlesData, setArticlesData] = useState({articles: []})
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const {isAuthenticated, user, cookies} = useContext(AuthContext);

    useEffect(() => {
        getArticles(1)
    }, []);

    useEffect(() => {
      console.log(articlesData)
    }, [articlesData]);

    const changePage = async (page) => {
        setCurrentPage(page)
        getArticles(page)

    }

    const getArticles = async (page) => {
        setLoading(true)
        fetch(`https://blog.kata.academy/api/articles?limit=5&offset=${page * 5 - 5}`, {
            headers: {
                'Authorization': `Token ${cookies['token-auth']}`,
            }
        })
            .then(response => response.json())
            .then(data => setArticlesData(data))
            .then(() => setLoading(false))
    }

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
            const newArticles = articlesData.articles.map((article) => article.slug === newArticle.slug ? newArticle : article)
            setArticlesData({...articlesData, articles: newArticles})
        }
    }



    return (
        <>
            <div className='article-list'>
                {loading ? (
                    <Spin size="large"/>
                ) : (
                    <>
                        {articlesData.articles.map(article => (
                            <div className='article rounded' key={article.slug}>
                                <div className='article__header'>
                                    <div className='article__header-left'>
                                        <div className='article__header-left-top'>
                                            <h2 className='article__title line-clamp-2'>
                                                <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                                            </h2>
                                            <button className={`article__header-favourites ${article.favorited ? 'text-red-500' : ''}`} onClick={() => changeLikes(article)}>
                                                <HeartOutlined/>
                                                {`   ${article.favoritesCount}`}
                                            </button>
                                        </div>
                                        <div className='article__header-left-tags'>
                                            {
                                                article.tagList.slice(0, 10).map((tag, index) => (
                                                    tag ? <div className='tag' key={index}>{tag}</div> : ''
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className='article__header-right'>
                                        <div className='article__header-details'>
                                            <div className='article__header-author'>{article.author.username}</div>
                                            <div
                                                className='article__header-created'>{format(article.updatedAt, 'MMMM d, yyyy')}</div>
                                        </div>
                                        <img className='author-image rounded-full' src={article.author.image}
                                             alt="Author Image"/>
                                    </div>
                                </div>
                                <div className='article__text'>
                                    <div className='line-clamp-3'>
                                        <ReactMarkdown>
                                            {`${article.description}`}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Pagination defaultCurrent={currentPage} total={articlesData.articlesCount} pageSize={5}
                                    showSizeChanger={false} onChange={(page) => changePage(page)}/>
                    </>
                )}
            </div>
        </>
    )

}