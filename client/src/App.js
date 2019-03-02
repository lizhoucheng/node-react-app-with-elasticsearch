import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sentences: [],
      keywords: '',
    }

    this.handleSendKeywords = this.handleSendKeywords.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
  }

  handleSendKeywords(event) {
    event.preventDefault();

    fetch('http://localhost:8000/search', {
      method: 'POST',
      body: JSON.stringify({keywords:this.state.keywords}),
      headers: {"Content-Type": "application/json"}
    }).then((response) => {
      response.json().then((body) => {
        this.setState({ sentences: body.result });
      });
    }).catch((error) => {
        console.log(error);
    });
  }

  handleKeywordChange(event) {
    this.setState({keywords: event.target.value});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <form onSubmit={this.handleSendKeywords}>
                <label>
                  keywords: 
                  <input name="keywordInput" onChange={this.handleKeywordChange}/>
                </label>
            <input type="submit" value="send" />
          </form>
        </header>
        <div>
          {this.state.sentences.map((comp, index) => {
            return <p key={index}>{comp}</p>
          })}
        </div>
      </div>
    );
  }
}

export default App;
