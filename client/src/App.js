import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EditPhoto from './pages/EditPhoto';
import About from './pages/About';
import Contact from './pages/Contact';
import MyAccount from './pages/MyAccount';
import AuthPage from './pages/AuthPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail'; 
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import './App.css';

// Layout component that wraps all pages
const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <GoogleOAuthProvider 
          clientId="107330914105-ib51ukl76ms65ihksn17c8nsqu6ulst4.apps.googleusercontent.com"
          onScriptLoadError={() => console.log('Failed to load Google OAuth script')}
          onScriptLoadSuccess={() => console.log('Google OAuth script loaded')}
        >
          <AuthProvider>
            <Layout />
          </AuthProvider>
        </GoogleOAuthProvider>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: 'edit-photo', element: <EditPhoto /> },
        { path: 'about', element: <About /> },
        { path: 'contact', element: <Contact /> },
        { path: 'login', element: <AuthPage type="login" /> },
        { path: 'signup', element: <AuthPage type="signup" /> },
        { path: 'my-account', element: <MyAccount /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'verify-email', element: <VerifyEmail /> },
        {path: '/privacy-policy', element: <PrivacyPolicy />},
        {path: '/terms-of-service', element: <TermsOfService />}
      ]
    }
  ], {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_prependBasename: true
    }
  });

function App() {
  return <RouterProvider router={router} />;
}

export default App;