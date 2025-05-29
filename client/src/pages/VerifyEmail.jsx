import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaEnvelope, FaArrowRight, FaHome } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const VerifyContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff0f5;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const VerificationCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(255, 105, 180, 0.1);
  max-width: 600px;
  width: 100%;
  margin: 2rem auto;
`;

const IconContainer = styled.div`
  font-size: 5rem;
  margin-bottom: 2rem;
  
  &.success {
    color: #28a745;
    animation: bounce 0.5s;
  }
  
  &.error {
    color: #dc3545;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-20px);}
    60% {transform: translateY(-10px);}
  }
`;

const Title = styled.h2`
  color: #ff69b4;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #555;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 2rem;
`;

const ContinueButton = styled.button`
  background: #ff69b4;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background: #ff1493;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
  }
`;

const HomeButton = styled(ContinueButton)`
  background: #ffcccb;
  color: #333;

  &:hover {
    background: #ff69b4;
    color: white;
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 105, 180, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ff69b4;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', or 'error'
  const [error, setError] = useState('');
  const { updateUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    const verifyEmail = async () => {
      try {
        if (!token) {
          throw new Error('Invalid verification link');
        }

        const response = await fetch('http://localhost:5000/api/verify-email', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        // First check if the response is OK
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Verification failed');
        }

        // Then try to parse the JSON
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Verification failed');
        }

        updateUser({ emailVerified: true });
        setStatus('success');
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.message || 'Failed to verify email');
        setStatus('error');
      }
    };

    // Add a small delay to ensure the loading state is visible
    const timer = setTimeout(verifyEmail, 1000);
    return () => clearTimeout(timer);
  }, [searchParams, updateUser]);

  return (
    <VerifyContainer>
      <ContentWrapper>
        <VerificationCard>
          {status === 'loading' ? (
            <>
              <LoadingSpinner />
              <Title>Verifying Your Email</Title>
              <Message>Please wait while we verify your email address...</Message>
            </>
          ) : status === 'error' ? (
            <>
              <IconContainer className="error">
                <FaTimesCircle />
              </IconContainer>
              <Title>Verification Error</Title>
              <Message>{error || 'Something went wrong during verification.'}</Message>
              <ButtonGroup>
                <HomeButton onClick={() => navigate('/')}>
                  <FaHome /> Return Home
                </HomeButton>
                <ContinueButton onClick={() => navigate('/my-account')}>
                  My Account <FaArrowRight />
                </ContinueButton>
              </ButtonGroup>
            </>
          ) : (
            <>
              <IconContainer className="success">
                <FaCheckCircle />
              </IconContainer>
              <Title>Email Verified Successfully!</Title>
              <Message>
                Thank you for verifying your email address. You now have full access to all features of Robeautify.
              </Message>
              <ButtonGroup>
                <HomeButton onClick={() => navigate('/')}>
                  <FaHome /> Return Home
                </HomeButton>
                <ContinueButton onClick={() => navigate('/my-account')}>
                  My Account <FaArrowRight />
                </ContinueButton>
              </ButtonGroup>
            </>
          )}
        </VerificationCard>
      </ContentWrapper>
    </VerifyContainer>
  );
}

export default VerifyEmail;