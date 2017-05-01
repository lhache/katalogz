// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import CopyForm from './CopyForm';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <CopyForm />
        </div>
      </div>
    );
  }
}
