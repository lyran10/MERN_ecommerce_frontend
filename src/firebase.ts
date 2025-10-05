import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBlydVM2jaeB-7TOXs2oonBUqHI8rGxi9Y",
  authDomain: 'mern-ecommerce-c1087.firebaseapp.com',
  projectId: 'mern-ecommerce-c1087',
  storageBucket: 'mern-ecommerce-c1087.firebasestorage.app',
  messagingSenderId: '998713064737',
  appId: '1:998713064737:web:7fcd6865742cd2966f9260'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
// export const googleProvider = new GoogleAuthProvider()

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account" // always show account chooser
});
