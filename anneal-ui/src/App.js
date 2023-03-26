import './App.css';
import Layout from './layout/Layout';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ServiceProvider } from './context/ServiceContext';

function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <ServiceProvider>
            <Layout />
          </ServiceProvider>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
