import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MyAppBar from './MyAppBar.js'
import reportWebVitals from './reportWebVitals';
import Calendar from "./calendar/Calendar";

ReactDOM.render(
<React.StrictMode>
    <MyAppBar />
    <Calendar />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
