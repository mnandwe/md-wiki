
import React, { Component } from 'react';
import axios from 'axios';
import {Article} from '../article/Article';
import {Link,Route, Switch} from 'react-router-dom';

import './ArticleList.css'

let apiRoot = 'http://localhost:9090'
if (process.env.NODE_ENV ==='production'){
  apiRoot='';
}
  
export class ArticleList extends Component {
  constructor(){
        super()
        this.state={
            articles:[]
        }
    }

  componentDidMount(){
        this.getArticles();
    }
  
  getArticles() {
    axios.get(`${apiRoot}/articles/`)
        .then(res => {
            if (res.data) {
              this.setState({
                articles: res.data.map(article => {
                  return (
                    <li key={article}><Link  to={article}> {article}</Link></li>
                  );
                })
              });
            } else {
              this.setState({
                articles: []
              });
            }
          });
        }
    
  
  render() {
        return (
              <div>
                <Switch>
                    <Route exact path='/'>    
                        <div className='container'>
                            <div className='head'> 
                                <h2> Wiki Articles</h2>
                            </div>
                            <ul className='result-list'>
                                {this.state.articles}
                            </ul>
                        </div>
                    </Route>
                    <Route exact path='/:name' component={Article}/>
                </Switch>
              </div>
      );
    }
  }