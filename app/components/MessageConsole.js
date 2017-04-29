import React, { Component } from 'react';
import styles from './MessageConsole.css';

export default class MessageConsole extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          { this.props.messages.map((message, i) => (<p key={i}>{message}</p>)) }
        </div>
      </div>
    )
  }
}
