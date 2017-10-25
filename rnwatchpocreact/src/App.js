import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
    super()
    this.state = {
      value: 0
    }
  }

  clickA = () => {
    this.setState({value: 1})
  }
  clickB = () => {
    this.setState({value: 0})
  }

  render() {
    return (
      <div className="App rotate">
        <p>{this.state.value ? 'A' : 'B'}</p>
        <button onClick={this.clickA} className="Button">A</button>
        <button onClick={this.clickB} className="Button">B</button>
      </div>
    );
  }
}

export default App;
