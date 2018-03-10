'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './components/app';
// import reducers from './reducers';

ReactDOM.render(
	<App/>, 
	document.getElementById('app')
);