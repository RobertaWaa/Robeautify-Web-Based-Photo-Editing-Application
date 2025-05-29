import React from 'react';
import styled from 'styled-components';

const SendMessageButton = ({ onClick, disabled }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      <span className="button-text">Send Message</span>
      <svg className="arrow-icon" width="15px" height="10px" viewBox="0 0 13 10">
        <path className="arrow-line" d="M1,5 L11,5" />
        <polyline className="arrow-head" points="8 1 12 5 8 9" />
      </svg>
      <div className="hover-effect" />
    </StyledButton>
  );
};

const StyledButton = styled.button`
  position: relative;
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.65, 0, 0.35, 1);
  border-radius: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  .button-text {
    position: relative;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #ff69b4;
    z-index: 2;
    transition: color 0.3s ease;
  }

  .arrow-icon {
    position: relative;
    margin-left: 8px;
    z-index: 2;
    transition: transform 0.3s ease;
  }

  .arrow-line, .arrow-head {
    stroke: #ff69b4;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    transition: stroke 0.3s ease;
  }

  .hover-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 45px;
    height: 100%;
    background: rgba(255, 105, 180, 0.15);
    border-radius: 50px;
    transition: all 0.4s cubic-bezier(0.65, 0, 0.35, 1);
    z-index: 1;
  }

  &:hover {
    .button-text {
      color: #ff1493;
    }

    .arrow-icon {
      transform: translateX(4px);
    }

    .arrow-line, .arrow-head {
      stroke: #ff1493;
    }

    .hover-effect {
      width: 100%;
      background: rgba(255, 105, 180, 0.1);
    }
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default SendMessageButton;