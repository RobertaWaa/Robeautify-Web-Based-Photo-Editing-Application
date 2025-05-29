import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const JoinNowButton = () => {
  return (
    <StyledWrapper>
      <Link to="/signup" className="btn">
        <div className="wrapper">
          <p className="text">Join Now</p>
          <div className="flower flower1">
            <div className="petal one" />
            <div className="petal two" />
            <div className="petal three" />
            <div className="petal four" />
          </div>
          <div className="flower flower2">
            <div className="petal one" />
            <div className="petal two" />
            <div className="petal three" />
            <div className="petal four" />
          </div>
          <div className="flower flower3">
            <div className="petal one" />
            <div className="petal two" />
            <div className="petal three" />
            <div className="petal four" />
          </div>
          <div className="flower flower4">
            <div className="petal one" />
            <div className="petal two" />
            <div className="petal three" />
            <div className="petal four" />
          </div>
          <div className="flower flower5">
            <div className="petal one" />
            <div className="petal two" />
            <div className="petal three" />
            <div className="petal four" />
          </div>
          <div className="flower flower6">
            <div className="petal one" />
            <div className="petal two" />
            <div className="petal three" />
            <div className="petal four" />
          </div>
        </div>
      </Link>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center; /* Centrează orizontal */
  align-items: center; /* Centrează vertical (opțional) */
  width: 100%; /* Asigură că ocupă întreaga lățime a containerului părinte */

  .btn {
    height: 4em;
    width: 12em;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0px solid black;
    cursor: pointer;
    text-decoration: none;
    margin: 0 auto; /* Adaugă margini automate pentru centrare suplimentară */
  }

  .wrapper {
    height: 2em;
    width: 8em;
    position: relative;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    font-size: 17px;
    z-index: 1;
    color: #000;
    padding: 4px 12px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.7);
    transition: all 0.5s ease;
  }

  .flower {
    display: grid;
    grid-template-columns: 1em 1em;
    position: absolute;
    transition: grid-template-columns 0.8s ease;
  }

  .flower1 {
    top: -12px;
    left: -13px;
    transform: rotate(5deg);
  }

  .flower2 {
    bottom: -5px;
    left: 8px;
    transform: rotate(35deg);
  }

  .flower3 {
    bottom: -15px;
    transform: rotate(0deg);
  }

  .flower4 {
    top: -14px;
    transform: rotate(15deg);
  }

  .flower5 {
    right: 11px;
    top: -3px;
    transform: rotate(25deg);
  }

  .flower6 {
    right: -15px;
    bottom: -15px;
    transform: rotate(30deg);
  }

  .petal {
    height: 1em;
    width: 1em;
    border-radius: 40% 70% / 7% 90%;
    background: linear-gradient(#ff69b4, #ffcccb); /* Culori roz */
    border: 0.5px solid #ff69b4;
    z-index: 0;
    transition: width 0.8s ease, height 0.8s ease;
  }

  .two {
    transform: rotate(90deg);
  }

  .three {
    transform: rotate(270deg);
  }

  .four {
    transform: rotate(180deg);
  }

  .btn:hover .petal {
    background: linear-gradient(#ff1493, #ff69b4); /* Culori roz mai închise la hover */
    border: 0.5px solid #ff1493;
  }

  .btn:hover .flower {
    grid-template-columns: 1.5em 1.5em;
  }

  .btn:hover .flower .petal {
    width: 1.5em;
    height: 1.5em;
  }

  .btn:hover .text {
    background: rgba(255, 255, 255, 0.4);
  }

  .btn:hover div.flower1 {
    animation: 15s linear 0s normal none infinite running flower1;
  }

  @keyframes flower1 {
    0% {
      transform: rotate(5deg);
    }

    100% {
      transform: rotate(365deg);
    }
  }

  .btn:hover div.flower2 {
    animation: 13s linear 1s normal none infinite running flower2;
  }

  @keyframes flower2 {
    0% {
      transform: rotate(35deg);
    }

    100% {
      transform: rotate(-325deg);
    }
  }

  .btn:hover div.flower3 {
    animation: 16s linear 1s normal none infinite running flower3;
  }

  @keyframes flower3 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .btn:hover div.flower4 {
    animation: 17s linear 1s normal none infinite running flower4;
  }

  @keyframes flower4 {
    0% {
      transform: rotate(15deg);
    }

    100% {
      transform: rotate(375deg);
    }
  }

  .btn:hover div.flower5 {
    animation: 20s linear 1s normal none infinite running flower5;
  }

  @keyframes flower5 {
    0% {
      transform: rotate(25deg);
    }

    100% {
      transform: rotate(-335deg);
    }
  }

  .btn:hover div.flower6 {
    animation: 15s linear 1s normal none infinite running flower6;
  }

  @keyframes flower6 {
    0% {
      transform: rotate(30deg);
    }

    100% {
      transform: rotate(390deg);
    }
  }
`;

export default JoinNowButton;