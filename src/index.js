import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import "./index_style.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // github page에 배포할 때 react-router를 사용하므로 프로젝트 기본 url 지정
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>
);
