import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import aboutBg from "../assets/images/about.jpg";
import easyToUseIcon from "../assets/images/easy-to-use-icon.png";
import accessibleIcon from "../assets/images/accessible-icon.png";
import supportIcon from "../assets/images/support-icon.png";

// Testimonial data
const testimonials = [
  {
    id: 1,
    quote:
      "Robeautify has transformed the way I edit photos. It's simple, yet powerful!",
    author: "Anna M.",
  },
  {
    id: 2,
    quote: "The best online photo editor I've ever used. Highly recommended!",
    author: "John D.",
  },
  {
    id: 3,
    quote:
      "I love how easy it is to use Robeautify. It's perfect for beginners like me.",
    author: "Sarah J.",
  },
  {
    id: 4,
    quote:
      "Robeautify has all the features I need, and it's completely free. Amazing!",
    author: "Michael B.",
  },
  {
    id: 5,
    quote:
      "The support team is fantastic. They helped me with all my questions.",
    author: "Emily D.",
  },
];

function About() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-element");
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(".animate-content");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: window.innerWidth > 768, // Only show arrows on desktop
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <GlobalResponsiveStyles>
      <AboutContainer>
        {/* Hero Section with background image */}
        <HeroSection style={{ backgroundImage: `url(${aboutBg})` }}>
          <HeroOverlay />
          <HeroContent className="animate-content">
            <h1>About Robeautify</h1>
            <p className="subtitle">
              Discover the story behind the magic of photo editing
            </p>
          </HeroContent>
        </HeroSection>

        {/* Our Story */}
        <Section>
          <SectionContent
            className="animate-content"
            style={{ transitionDelay: "0.1s" }}
          >
            <CenteredHeading>Our Story</CenteredHeading>
            <ContentWrapper>
              <p>
                Robeautify was born out of a passion for photography and a
                desire to make professional photo editing accessible to
                everyone. Our journey began with a simple idea: to create a tool
                that empowers people to transform their photos into stunning
                works of art, without the need for complex software or expensive
                subscriptions.
              </p>
            </ContentWrapper>
          </SectionContent>
        </Section>

        {/* Our Mission */}
        <Section>
          <SectionContent
            className="animate-content"
            style={{ transitionDelay: "0.2s" }}
          >
            <CenteredHeading>Our Mission</CenteredHeading>
            <ContentWrapper>
              <p>
                We believe everyone should be able to edit photos effortlessly.
                Robeautify is built on the idea that great edits shouldn't
                require technical skills. Whether you're touching up a selfie or
                adjusting a landscape, we keep it easy and accessible. For
                casual users who want to polish photos without professional
                software. For beginners learning the basics.
              </p>
            </ContentWrapper>
          </SectionContent>
        </Section>

        {/* Why Choose Us */}
        <Section>
          <SectionContent
            className="animate-content"
            style={{ transitionDelay: "0.3s" }}
          >
            <CenteredHeading>Why Choose Us?</CenteredHeading>
            <FeaturesGrid>
              <FeatureCard>
                <FeatureIcon src={easyToUseIcon} alt="Easy to Use" />
                <h3>Easy to Use</h3>
                <p>
                  Our interface is intuitive and user-friendly, designed for
                  both beginners and professionals.
                </p>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon src={accessibleIcon} alt="Accessible" />
                <h3>Accessible</h3>
                <p>
                  Robeautify is completely free and available to everyone,
                  anywhere, anytime.
                </p>
              </FeatureCard>
              <FeatureCard>
                <FeatureIcon src={supportIcon} alt="Support" />
                <h3>Support</h3>
                <p>
                  Our team is always here to help you with any questions or
                  issues.
                </p>
              </FeatureCard>
            </FeaturesGrid>
          </SectionContent>
        </Section>

        {/* Testimonials Carousel */}
        <TestimonialSection>
          <SectionContent
            className="animate-content"
            style={{ transitionDelay: "0.4s" }}
          >
            <CenteredHeading>What Our Users Say</CenteredHeading>
            <TestimonialCarousel>
              <Slider {...carouselSettings}>
                {testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id}>
                    <Quote>"{testimonial.quote}"</Quote>
                    <Author>- {testimonial.author}</Author>
                  </TestimonialCard>
                ))}
              </Slider>
            </TestimonialCarousel>
          </SectionContent>
        </TestimonialSection>

        {/* Final CTA */}
        <CTASection>
          <CTAContent
            className="animate-content"
            style={{ transitionDelay: "0.5s" }}
          >
            <CenteredHeading>Ready to Transform Your Photos?</CenteredHeading>
            <CTAButton to="/edit-photo">
              <span>Start Creating Now</span>
              <svg
                className="arrow-icon"
                viewBox="0 0 16 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" />
              </svg>
            </CTAButton>
          </CTAContent>
        </CTASection>
      </AboutContainer>
    </GlobalResponsiveStyles>
  );
}

// Styled components
const CenteredHeading = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #ff69b4;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #ff69b4, #ff9a9e);
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 105, 180, 0.7);
`;

const TestimonialSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(to bottom, #fff9fb, #fff0f5);
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ff69b4' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.6;
    z-index: -1;
  }
  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const TestimonialCarousel = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;

  .slick-list {
    padding: 20px 0;
    margin: 0 -15px;
  }

  .slick-slide {
    padding: 0 15px;
    transition: all 0.3s ease;

    > div {
      margin: 0 auto;
      max-width: 600px;
    }
  }

  .slick-prev {
    left: -50px;
  }

  .slick-next {
    right: -50px;
  }

  .slick-prev,
  .slick-next {
    width: 40px;
    height: 40px;

    &:before {
      color: #ff69b4;
      font-size: 24px;
    }

    &:hover:before {
      color: white;
    }
  }
`;

const TestimonialCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 5px 30px rgba(255, 105, 180, 0.1);
  width: 100%;
  margin: 0 auto;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 250px;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  border: 1px solid rgba(255, 105, 180, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(255, 105, 180, 0.15);
  }
`;

const Quote = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #555;
  font-style: italic;
  margin-bottom: 20px;
`;

const Author = styled.p`
  font-weight: 600;
  color: #ff69b4;
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
      rgba(255, 105, 180, 0.8),
      rgba(255, 105, 180, 0.9)
    ),
    url(${aboutBg}) center/cover no-repeat;
  position: relative;
  margin-bottom: 80px;
  overflow: hidden;

  animation: gradientShift 15s ease infinite alternate;

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;

  h1 {
    font-size: 4.5rem;
    margin-bottom: 20px;
    font-weight: 800;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    background: linear-gradient(90deg, #fff, #ffcccb);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .subtitle {
    font-size: 1.8rem;
    opacity: 0.9;
    margin-bottom: 30px;
  }

  animation: float 3s ease-in-out infinite alternate;

  @keyframes float {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-20px);
    }
  }
`;

const Section = styled.section`
  padding: 100px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(255, 105, 180, 0.05) 0%,
      rgba(255, 154, 158, 0.05) 100%
    );
    z-index: -1;
  }
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  text-align: justify;
  hyphens: manual;
  word-spacing: normal;

  p {
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.1);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: rotate(30deg);
    transition: all 0.5s ease;
    opacity: 0;
  }

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 12px 40px rgba(255, 105, 180, 0.2);

    &::before {
      opacity: 1;
      animation: shine 1.5s ease;
    }
  }

  @keyframes shine {
    0% {
      transform: rotate(30deg) translate(-10%, -10%);
    }
    100% {
      transform: rotate(30deg) translate(10%, 10%);
    }
  }
`;

const FeatureIcon = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 auto;
`;

const CTASection = styled.section`
  padding: 120px 0;
  background: linear-gradient(135deg, #ff69b4 0%, #ff9a9e 100%);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const CTAContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  h2 {
    font-size: 2.5rem;
    color: white;
    margin-bottom: 40px;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 15px 40px;
  background: white;
  color: #ff69b4;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid white;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    background: #ff69b4;
    left: 0;
    top: 0;
    transition: all 0.3s ease;
    z-index: -1;
  }

  &:hover {
    color: white;
    border-color: #ff69b4;

    &::before {
      width: 100%;
    }

    .arrow-icon {
      transform: rotate(90deg);
      background: white;
      border: none;

      path {
        fill: #ff69b4;
      }
    }
  }

  .arrow-icon {
    width: 32px;
    height: 32px;
    padding: 6px;
    border: 2px solid #ff69b4;
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: rotate(45deg);

    path {
      fill: #ff69b4;
    }
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const responsiveStyles = `
  @media (max-width: 1200px) {
    ${AboutContainer} {
      padding: 0 15px;
    }
  }

  @media (max-width: 992px) {
    ${HeroContent} {
      h1 {
        font-size: 3.5rem;
      }
      .subtitle {
        font-size: 1.5rem;
      }
    }

    ${CenteredHeading} {
      font-size: 2.2rem;
    }
  }

  @media (max-width: 768px) {
    ${HeroSection} {
      min-height: 70vh;
      margin-bottom: 50px;
    }

    ${HeroContent} {
      padding: 20px;
      
      h1 {
        font-size: 2.8rem;
        margin-bottom: 15px;
      }
      
      .subtitle {
        font-size: 1.2rem;
        margin-bottom: 20px;
      }
    }

    ${Section} {
      padding: 60px 0;
    }

    ${CenteredHeading} {
      font-size: 2rem;
      margin-bottom: 30px;
    }

    ${FeaturesGrid} {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    ${FeatureCard} {
      padding: 30px 20px;
    }

    ${TestimonialCarousel} {
      .slick-prev {
        left: -25px;
      }
      
      .slick-next {
        right: -25px;
      }
    }

    ${TestimonialCard} {
      padding: 30px 20px;
      min-height: auto;
    }

    ${CTASection} {
      padding: 80px 0;
      
      h2 {
        font-size: 2rem;
        margin-bottom: 30px;
      }
    }

    ${CTAButton} {
      padding: 12px 30px;
      font-size: 1rem;
    }
  }

  @media (max-width: 576px) {
    ${HeroContent} {
      h1 {
        font-size: 2.2rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
    }

    ${CenteredHeading} {
      font-size: 1.8rem;
    }

    ${ContentWrapper} {
      font-size: 1rem;
    }

    ${FeatureIcon} {
      width: 60px;
      height: 60px;
    }

    ${Quote} {
      font-size: 1rem;
    }
  }
`;

// Component to inject the responsive styles
const GlobalResponsiveStyles = styled.div`
  ${responsiveStyles}
`;

export default About;
