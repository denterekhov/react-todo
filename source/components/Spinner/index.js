// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';

export default class Spinner extends Component {
    render () {
        return this.props.isSpinning ? (
            <div className = { Styles.spinner } />
        ) : null;
    }
}
