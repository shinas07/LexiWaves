import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store, persistor } from './redux/Store.jsx'; 
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <GoogleOAuthProvider clientId="862039732883-28g3c65vg9vj08d5antbeut9hmgvih97.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);
