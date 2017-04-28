// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
// var fs = require('fs');
import {copyFiles} from '../utils/fsHelpers';
import R from 'ramda';
import Promise from 'bluebird';


export default class Home extends Component {

  state = {
    sourceFolder: "",
    destFolder: "",
    items: ['XKCD', 'XKCE'],
    messages: []
  }
  // lifecycle hooks
  componentDidMount() {
    this.setupInput();
  }
  componentDidUpdate() {
    this.setupInput();
  }

  // custom
  setupInput() {
    this.refs.SourceFolder.directory = true;
    this.refs.SourceFolder.webkitdirectory = true;
    this.refs.DestFolder.directory = true;
    this.refs.DestFolder.webkitdirectory = true;
  }

  handleSourceFolderChange = (event) => {
    event.preventDefault();
    this.setState({
      sourceFolder: event.target.files[0].path
    });
  }

  handleDestFolderChange = (event) => {
    event.preventDefault();
    this.setState({
      destFolder: event.target.files[0].path
    });
  }

  onSubmit = () => {
      copyFiles('/Users/h/workspace/ekus', '/Users/h/workspace/ekus/copy', this.state.items, this.stackMessage)
      .then(() => {
          // this.resetMessages();
      })
  }

  resetMessages = () => {
    this.setState({
      items: []
    });
  }

  stackMessage = (message) => {
    // log FTW
    console.log(message);

    // stack in state
    this.setState({
      messages: R.flatten(R.append(message, this.state.messages))
    });
  }

  handleItemChange = (event) => {
    let itemList = event.target.value.split(',');
    let items = itemList.map(item => item.trim())
    this.setState({items: items});
  }


  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <section>
        	  <label>
        	    <p>Select the folder to scan</p>
        	    <input onChange={ this.handleSourceFolderChange } type="file" ref="SourceFolder" multiple/>
        	  </label>
        	</section>

          <section>
        	  <label>
        	    <p>Select destination folder</p>
        	    <input onChange={ this.handleDestFolderChange } type="file" ref="DestFolder" multiple/>
        	  </label>
        	</section>

          <section>
        	  <label>
        	    <p>Paste product IDs</p>
              <textarea value={this.state.items} onChange={this.handleItemChange} />
        	  </label>
        	</section>

          <button onClick={this.onSubmit }>submit</button>

          <aside>
            {this.state.messages.map(function(message, i){
                return <p key={i}>{message}</p>;
            })}
          </aside>
        </div>
      </div>
    );
  }
}
