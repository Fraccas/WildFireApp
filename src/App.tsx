import React, { Component } from 'react';
import AppContainer from './AppContainer';

interface IHomeProps {}
interface IHomeState {}

export default class App extends Component<IHomeProps, IHomeState> {

  render () {
    return (
      <AppContainer /> 
    );
  }
}

