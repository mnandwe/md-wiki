
import React, { Component } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './Article.css';

let apiRoot = 'http://localhost:9090'
if (process.env.NODE_ENV ==='production'){
  apiRoot='';
}

export class EditArticle extends Component {
    constructor(){
        super();
        this.state = {
            article:{},
            editableContent: '',
            changesSaved: false
        };

        this.updateContent = this.updateContent.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount(){
        this.getArticle();
    }

    getArticle() {
        const { match: { params } } = this.props;
        axios.get(`${apiRoot}/articles/${params.name}`)
        .then(res => {
            if (res.data  && res.data.Content) {
              this.setState({
                article: {
                  name: params.name,
                  content: res.data.Content
                },
                editableContent: res.data.Content,
              });
            } else { // not found
                this.setState({
                    article: {
                        name: params.name,
                        content: ''
                    },
                    editableContent: '',
                  });
            }
        }).catch(err=> {
              this.setState({
                article: {
                    name: params.name,
                    content: ''
                },
                editableContent: '',
              });
            
          });
    }
    
    saveChanges() {
        axios.put(`${apiRoot}/articles/${this.state.article.name}`, 
            this.state.editableContent,
            {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(res => {
                this.setState({
                        article: {
                            name: this.state.article.name,
                            content: this.state.editableContent
                        },
                        changesSaved: true
                    });
            }).catch(err=> {
                if(err.response){
                    console.log(err.response);
                }
                console.log(err);
              
            });
      }

    updateContent(event) {
        this.setState({editableContent:event.target.value, changesSaved:false});
    }

    cancel() {
        this.setState({editableContent: this.state.article.content});
    }

    
  
      render() {
          const changesSaved = this.state.changesSaved;
        return (
            <div className='container'>
                <div className='article-head head'>
                    <h2>{this.state.article.name}</h2>
                </div>
                <div className='article-editable'>
                    <h3>Edit Content</h3>
                    <textarea name='editableContent' onChange={this.updateContent} value={this.state.editableContent}/>
                </div>
                <div className='article-content article-editable'>
                    <h3>Content Preview</h3>
                    <div className="preview">
                        <ReactMarkdown source={this.state.editableContent}/>
                    </div>
                </div>
                <div>
                    <button onClick={this.saveChanges}>Save</button>
                    <button onClick={this.cancel}>Cancel</button>
                    {changesSaved === true && <span>Saved!</span>}
                </div>
            </div>
      );
    }
  }