// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import CopyForm from './CopyForm';
import logo from '../../img/logo.png'


// <img src={logo} />
export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <div className={styles.logoHolder}>

          </div>
          <CopyForm />
        </div>
      </div>
    );
  }
}
