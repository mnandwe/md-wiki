import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import {Article} from './article/Article'
import {EditArticle} from './article/EditArticle'
import {ArticleList} from './articleList/ArticleList'
import './App.css';

function App() {
  return (
    <Router>
    <div className='App'>
      <header className='App-header'>
        <p>
        <Link to={'/'}>  MD Wiki </Link>
        </p>
      </header>
      
    <Switch>
    <Route exact path='/'>
      <ArticleList />
    </Route>
    
    <Route exact path='/:name' component={Article}/>
    <Route exact path='/edit/:name' component={EditArticle}/>
  </Switch>
    </div>
    </Router>
  );
}

export default App;
