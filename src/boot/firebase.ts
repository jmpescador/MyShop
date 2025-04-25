import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_jUtU_j0CclWWOiAMf5zvUFmyub9LdoI",
  authDomain: "myshop-3170e.firebaseapp.com",
  databaseURL: "https://myshop-3170e-default-rtdb.firebaseio.com",
  projectId: "myshop-3170e",
  storageBucket: "myshop-3170e.firebasestorage.app",
  messagingSenderId: "795959751529",
  appId: "1:795959751529:web:2e8a184e6c480c85e983f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
