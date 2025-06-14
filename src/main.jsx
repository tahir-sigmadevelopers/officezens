import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store.jsx'
import { Provider } from 'react-redux'
import axios from 'axios'

// Configure axios to always include credentials
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
