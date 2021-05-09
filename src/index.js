import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

/**
 * Main entry-point for react application, mounts the {@link App} ReactNode into
 * the DOM.
 */
ReactDOM.render( 
  <App />,
  document.getElementById('root')
);

