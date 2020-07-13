import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Article.css';

let apiRoot = 'http://localhost:9090'
if (process.env.NODE_ENV === 'production') {
  apiRoot = '';
}

export class Article extends Component {
  constructor() {
    super()
    this.state = {
      article: {},
      articleNotFound: true,
    }
  }

  componentDidMount() {
    this.getArticle();
  }

  getArticle() {
    const { match: { params } } = this.props;
    axios.get(`${apiRoot}/articles/${params.name}`)
      .then(res => {
        if (res.data && res.data.Content) {
          this.setState({
            article: {
              name: params.name,
              content: res.data.Content
            },
            articleNotFound: false
          });
        } else {
          this.setState({
            article: {
              name: params.name
            }
          });
        }
      }).catch(err => {
        this.setState({
          article: {
            name: params.name
          }
        });
      });
  }

  editLink() {
    return '/edit' + this.state.article.name;
  }


  render() {
    return (
      this.state.articleNotFound === false ?
        <div id='article-container'>
          <div className='article-head'>
            <h2>{this.state.article.name}</h2>
            <div className='article-edit'><Link to={'/edit/' + this.state.article.name}> Edit </Link></div>
          </div>
          <div className='article-content'>
            <ReactMarkdown source={this.state.article.content} />
          </div>
        </div>
        :
        <div id='article-container'>
          <div className='article-head'>
            <h2>Article Not found</h2>
            <div className='article-edit'><Link to={'/edit/' + this.state.article.name}> Edit </Link></div>
          </div>
          <div>
            <p>No article with this exact name found, use Edit button to add it.</p>
          </div>
        </div>
    );
  }
}