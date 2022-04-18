import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import './translation/i18n'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={(<div style={{display:'flex', justifyContent:"center", alignItems:'center', height:'100%'}}>Loading...</div>)}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);


