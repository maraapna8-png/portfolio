import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD9h4kUhrMcUvgqElLccGrWf_RMccBRHUE",
    authDomain: "gen-lang-client-0853517042.firebaseapp.com",
    projectId: "gen-lang-client-0853517042",
    storageBucket: "gen-lang-client-0853517042.firebasestorage.app",
    messagingSenderId: "1037283494850",
    appId: "1:1037283494850:web:e66f47109890380636245b"
  };
