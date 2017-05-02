import React, { Component } from 'react';
import styles from './MessageConsole.css';

export default class MessageConsole extends Component {

  componentDidUpdate() {
    this.scrollToBottom();
  }

  showContent() {
    return this.props.messages.length
      ? this.props.messages.map((message, i) => (<p key={i}>>_ {message}</p>))
      : (<p>>_ Waiting for instructions...</p>)
  }

  scrollToBottom() {
    const scrollHeight = this.messageList.scrollHeight;
    const height = this.messageList.clientHeight;
    const maxScrollTop = scrollHeight - height;
    this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.consoleHeader}>>_ Console</div>
        <div
          className={styles.messageList}
          ref={(div) => {
            this.messageList = div;
          }}
        >
          {this.showContent()}

        </div>
      </div>
    )
  }
}

//{ this.props.messages.map((message, i) => (<p key={i}>>_ {message}</p>)) }
