import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import easyToUseImage from "../assets/images/easy-to-use.png";
import creativeFiltersImage from "../assets/images/creative-filters.png";
import itsFreeImage from "../assets/images/its-free.png";
import deviceMockup from "../assets/images/device-mockup.png";
import JoinNowButton from "../components/JoinNowButton";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-element");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const animatedElements = document.querySelectorAll(".animate-content");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Modern Hero Section with Gradient Mesh Background */}
      <HeroSection className="d-flex flex-column justify-content-center align-items-center">
        <HeroContent>
          <h1 className="display-2 text-white animate-content">
            <span className="gradient-text">Filter, edit, shine.</span>
          </h1>
          <h2 className="text-white mb-4 animate-content">Robeautify.</h2>
          <p className="lead text-white text-center mb-5 animate-content">
            Transform your photos into stunning works of art with just a few
            clicks.
            <br />
            Enjoy simple, intuitive, and professional editing tools designed for
            everyone.
          </p>
          <StyledWrapper className="animate-content">
            <Link to="/edit-photo" id="btn">
              <span>Start Editing Now</span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </StyledWrapper>
        </HeroContent>
        <HeroPattern />
      </HeroSection>

      {/* How It Works Section */}
      <HowItWorksSection>
        <div className="text-center">
          <SectionTitle className="animate-content">How it works?</SectionTitle>
          <StyledCards>
            <div className="cards">
              <FeatureCard className="animate-content">
                <NumberBadge>1</NumberBadge>
                <h3>Bring your memories to life!</h3>
                <p>
                  Upload your photo and get ready to turn it into something
                  amazing.
                </p>
              </FeatureCard>
              <FeatureCard
                className="animate-content"
                style={{ transitionDelay: "0.2s" }}
              >
                <NumberBadge>2</NumberBadge>
                <h3>Unleash your creativity!</h3>
                <p>
                  Use our powerful tools to adjust lighting, colors, and
                  details.
                </p>
              </FeatureCard>
              <FeatureCard
                className="animate-content"
                style={{ transitionDelay: "0.4s" }}
              >
                <NumberBadge>3</NumberBadge>
                <h3>Ready to shine?</h3>
                <p>
                  Save your edited photo and share it with the world. Be proud
                  of the result!
                </p>
              </FeatureCard>
            </div>
          </StyledCards>
        </div>
      </HowItWorksSection>

      {/* Features Carousel Section */}
      <FeaturesSection>
        <SectionTitle className="animate-content">
          The magic of editing at your fingertips
        </SectionTitle>
        <StyledCarousel>
          <Slider {...settings}>
            <FeatureSlide>
              <img
                src={easyToUseImage}
                alt="Easy-to-use Interface"
                className="slide-image"
              />
              <h3>Easy-to-use Interface</h3>
              <p>Intuitive tools for seamless editing.</p>
            </FeatureSlide>
            <FeatureSlide style={{ transitionDelay: "0.2s" }}>
              <img
                src={creativeFiltersImage}
                alt="Creative Filters"
                className="slide-image"
              />
              <h3>Creative Filters</h3>
              <p>
                Choose from a vast selection of filters to give your photos a
                unique look.
              </p>
            </FeatureSlide>
            <FeatureSlide style={{ transitionDelay: "0.4s" }}>
              <img src={itsFreeImage} alt="It's free" className="slide-image" />
              <h3>It's free</h3>
              <p>Anyone can use it anytime for free!</p>
            </FeatureSlide>
          </Slider>
        </StyledCarousel>
      </FeaturesSection>

      {/* Community Section */}
      <CommunitySection>
        <div className="text-center">
          <SectionTitle className="animate-content">
            Join Our Creative Community
          </SectionTitle>
          <div className="animate-content">
            <JoinNowButton />
          </div>
        </div>
      </CommunitySection>

      {/* Multi-Device Section */}
      <MultiDeviceSection>
        <div className="container">
          <SectionTitle className="animate-content">
            Available on both Mobile & Web
          </SectionTitle>
          <p className="lead animate-content">
            Enjoy creative freedom anywhere, anytime!
          </p>
          <div className="animate-content" style={{ transitionDelay: "0.3s" }}>
            <img
              src={deviceMockup}
              alt="Mobile and Web App Mockups"
              className="device-mockup"
            />
          </div>
        </div>
      </MultiDeviceSection>

      {/* Global Styles */}
      <GlobalStyles />
    </div>
  );
}

// Styled Components
const GlobalStyles = styled.div`
  /* Scroll Animations */
  .animate-content {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .animate-content.show-element {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  /* Delay-uri personalizate pentru fiecare element */
  .hero-section .animate-content:nth-child(1) {
    transition-delay: 0.1s;
  }
  .hero-section .animate-content:nth-child(2) {
    transition-delay: 0.2s;
  }
  .hero-section .animate-content:nth-child(3) {
    transition-delay: 0.3s;
  }
  .hero-section .animate-content:nth-child(4) {
    transition-delay: 0.4s;
  }

  .features-section .animate-content:nth-child(1) {
    transition-delay: 0.2s;
  }
  .features-section .animate-content:nth-child(2) {
    transition-delay: 0.3s;
  }
  .features-section .animate-content:nth-child(3) {
    transition-delay: 0.4s;
  }

  @media (prefers-reduced-motion) {
    .animate-content {
      transition: none;
      opacity: 1;
      transform: none;
    }
  }
`;

const HeroSection = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #ff1493, #ff9a9e);
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    font-size: 4rem;
    margin-bottom: 20px;
    font-weight: 800;

    .gradient-text {
      background: linear-gradient(90deg, #fff, #ffcccb);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  h2 {
    font-size: 3rem;
    font-weight: 700;
  }

  p {
    font-size: 1.5rem;
    max-width: 800px;
    margin: 0 auto 40px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }
    h2 {
      font-size: 2rem;
    }
    p {
      font-size: 1.2rem;
    }
  }
`;

const HeroPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 20%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 20%
    );
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 60px;
  color: ${(props) => props.theme || "#2d3748"};
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #ff69b4, #ff9a9e);
    border-radius: 2px;
  }
`;

const HowItWorksSection = styled.section`
  padding: 120px 20px;
  background: #f8fafc;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ff69b4' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
  }
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1) !important;
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 105, 180, 0.1);
  will-change: transform, opacity;

  h3 {
    color: #2d3748;
    margin-bottom: 15px;
    font-size: 1.5rem;
  }

  p {
    color: #4a5568;
    line-height: 1.6;
  }

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 15px 40px rgba(255, 105, 180, 0.15);
  }
`;

const NumberBadge = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ff69b4, #ff9a9e);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 20px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
`;

const StyledCards = styled.div`
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const FeaturesSection = styled.section`
  padding: 120px 20px;
  background: white;
  text-align: center;
`;

const FeatureSlide = styled.div`
  padding: 40px 20px;
  text-align: center;

  .slide-image {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin: 0 auto 20px;
  }

  h3 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 10px;
  }

  p {
    color: #4a5568;
    max-width: 80%;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const StyledCarousel = styled.div`
  max-width: 1000px;
  margin: 0 auto;

  .slick-slider {
    position: relative;
  }

  .slick-prev,
  .slick-next {
    width: 50px;
    height: 50px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    z-index: 1;
    transition: all 0.3s ease;

    &:before {
      color: #ff69b4;
      font-size: 24px;
      opacity: 1;
    }

    &:hover {
      background: #ff69b4;

      &:before {
        color: white;
      }
    }
  }

  .slick-prev {
    left: -60px;
  }

  .slick-next {
    right: -60px;
  }

  .slick-dots li button:before {
    color: #ff69b4;
    opacity: 0.5;
    font-size: 10px;
  }

  .slick-dots li.slick-active button:before {
    opacity: 1;
    color: #ff69b4;
  }
`;

const CommunitySection = styled.section`
  padding: 120px 20px;
  background: linear-gradient(135deg, #ff69b4, #ff9a9e);
  text-align: center;
  position: relative;
  overflow: hidden;

  ${SectionTitle} {
    color: white;

    &::after {
      background: white;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
  }
`;

const MultiDeviceSection = styled.section`
  padding: 120px 20px;
  background: #f8fafc;
  text-align: center;

  .lead {
    font-size: 1.5rem;
    color: #4a5568;
    max-width: 600px;
    margin: 0 auto 40px;
  }

  .device-mockup {
    max-width: 800px;
    width: 100%;
    height: auto;
    margin: 0 auto;
  }
`;

const StyledWrapper = styled.div`
  a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    text-decoration: none;
    transition: all 0.3s ease;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

    svg {
      transition: transform 0.3s ease;
    }

    &:hover {
      background: white;
      color: #ff69b4;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

      svg {
        transform: translateX(5px);
      }
    }
  }
`;

export default Home;
