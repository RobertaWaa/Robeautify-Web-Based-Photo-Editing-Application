import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 2rem 0 1rem;
  background: linear-gradient(45deg, #ffcccb, #ff69b4);
  color: #333;
  margin-top: auto;
  flex-shrink: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const FooterLogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.3),
    0 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

const LogoImage = styled.img`
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const LogoText = styled.span`
  margin-left: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.3),
    0 0 0 2px rgba(255, 255, 255, 0.5),
    0 0 0 4px rgba(255, 107, 157, 0.3);
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  img {
    height: 40px;
  }
  
  span {
    margin-left: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }
`;

const FooterHeading = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const FooterLink = styled(Link)`
  font-size: 0.875rem;
  color: #333;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterLegalLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  
  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

function Footer() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleLogout = () => {
    logout();
    navigate('/');
    window.scrollTo(0, 0); // Adaugă scroll la top după logout
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll smooth la top
  };

  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterGrid>
          <FooterColumn>
            <FooterLogoContainer>
              <LogoImage src={logo} alt="Robeautify Logo" />
              <LogoText>Robeautify</LogoText>
            </FooterLogoContainer>
            <FooterText>
              Your photos, perfected with just a few clicks!
            </FooterText>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>Navigation</FooterHeading>
            <FooterLink to="/" onClick={handleLinkClick}>Home</FooterLink>
            <FooterLink to="/edit-photo" onClick={handleLinkClick}>Edit Photo</FooterLink>
            <FooterLink to="/about" onClick={handleLinkClick}>About Us</FooterLink>
            <FooterLink to="/contact" onClick={handleLinkClick}>Contact</FooterLink>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>Account</FooterHeading>
            {currentUser ? (
              <>
                <FooterLink to="/my-account" onClick={handleLinkClick}>My Account</FooterLink>
                <FooterText as="button" onClick={handleLogout} style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  textAlign: 'left',
                  padding: 0
                }}>
                  Log Out
                </FooterText>
              </>
            ) : (
              <>
                <FooterLink to="/login" onClick={handleLinkClick}>Log In</FooterLink>
                <FooterLink to="/signup" onClick={handleLinkClick}>Sign Up</FooterLink>
              </>
            )}
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>Contact</FooterHeading>
            <FooterText>robeautify@gmail.com</FooterText>
            <FooterText>+40 123 456 789</FooterText>
            <FooterText>Bucharest, Romania</FooterText>
          </FooterColumn>
        </FooterGrid>
        
        <FooterBottom>
          <FooterText>© {currentYear} Robeautify. All rights reserved.</FooterText>
          <FooterLegalLinks>
            <FooterLink to="/privacy-policy" onClick={handleLinkClick}>Privacy Policy</FooterLink>
            <FooterLink to="/terms-of-service" onClick={handleLinkClick}>Terms of Service</FooterLink>
          </FooterLegalLinks>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
}

export default Footer;