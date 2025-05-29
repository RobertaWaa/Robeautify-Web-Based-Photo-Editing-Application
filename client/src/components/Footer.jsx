import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 1rem 0;
  background: linear-gradient(45deg, #ffcccb, #ff69b4);
  color: white;
  text-align: center;
  margin-top: auto; 
  flex-shrink: 0; 
`;

function Footer() {
  return (
    <FooterWrapper>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Robeautify. All rights reserved.</p>
      </div>
    </FooterWrapper>
  );
}

export default Footer;