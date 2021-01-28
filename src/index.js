import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import layouts from './Configs/default_layouts'

ReactDOM.render(
  <React.StrictMode>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
    <App default_layout={layouts.qwerty_sixty_percent} />
  </React.StrictMode>,
  document.getElementById('root')
);
