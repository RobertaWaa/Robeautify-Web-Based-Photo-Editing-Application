import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import aboutBg from '../assets/images/about.jpg'; 
import '../assets/styles/about.css';
import easyToUseIcon from '../assets/images/easy-to-use-icon.png';
import accessibleIcon from '../assets/images/accessible-icon.png';
import supportIcon from '../assets/images/support-icon.png';

// Testimonial data
const testimonials = [
    {
      id: 1,
      quote: "Robeautify has transformed the way I edit photos. It's simple, yet powerful!",
      author: "Anna M."
    },
    {
      id: 2,
      quote: "The best online photo editor I've ever used. Highly recommended!",
      author: "John D."
    },
    {
      id: 3,
      quote: "I love how easy it is to use Robeautify. It's perfect for beginners like me.",
      author: "Sarah J."
    },
    {
      id: 4,
      quote: "Robeautify has all the features I need, and it's completely free. Amazing!",
      author: "Michael B."
    },
    {
      id: 5,
      quote: "The support team is fantastic. They helped me with all my questions.",
      author: "Emily D."
    }
  ];

  function About() {
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
          }
        });
      }, { threshold: 0.1 });
  
      const animatedElements = document.querySelectorAll('.animate-content');
      animatedElements.forEach(el => observer.observe(el));
  
      return () => observer.disconnect();
    }, []);

    // Update carousel settings
    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: true,
        centerMode: false,
        focusOnSelect: false,
        variableWidth: false,
        adaptiveHeight: false
      };
    
      return (
        <AboutContainer>
          {/* Hero Section with background image */}
          <HeroSection style={{ backgroundImage: `url(${aboutBg})` }}>
            <HeroOverlay />
            <HeroContent className="animate-content">
              <h1>About Robeautify</h1>
              <p className="subtitle">Discover the story behind the magic of photo editing</p>
            </HeroContent>
          </HeroSection>
    
          {/* Our Story */}
          <Section>
            <SectionContent className="animate-content" style={{ transitionDelay: '0.1s' }}>
              <CenteredHeading>Our Story</CenteredHeading>
              <ContentWrapper>
                <p>Robeautify was born out of a passion for photography and a desire to make professional photo editing accessible to everyone. Our journey began with a simple idea: to create a tool that empowers people to transform their photos into stunning works of art, without the need for complex software or expensive subscriptions.</p>
              </ContentWrapper>
            </SectionContent>
          </Section>
    
          {/* Our Mission */}
          <Section>
  <SectionContent className="animate-content" style={{ transitionDelay: '0.2s' }}>
    <CenteredHeading>Our Mission</CenteredHeading>
    <ContentWrapper>
      <p>We believe everyone should be able to edit photos effortlessly. Robeautify is built on the idea that great edits shouldn't require technical skills. Whether you're touching up a selfie or adjusting a landscape, we keep it easy and accessible. For casual users who want to polish photos without professional software. For beginners learning the basics.</p>
    </ContentWrapper>
  </SectionContent>
</Section>
    
          {/* Why Choose Us */}
          <Section>
            <SectionContent className="animate-content" style={{ transitionDelay: '0.3s' }}>
              <CenteredHeading>Why Choose Us?</CenteredHeading>
              <FeaturesGrid>
                <FeatureCard>
                  <FeatureIcon src={easyToUseIcon} alt="Easy to Use" />
                  <h3>Easy to Use</h3>
                  <p>Our interface is intuitive and user-friendly, designed for both beginners and professionals.</p>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon src={accessibleIcon} alt="Accessible" />
                  <h3>Accessible</h3>
                  <p>Robeautify is completely free and available to everyone, anywhere, anytime.</p>
                </FeatureCard>
                <FeatureCard>
                  <FeatureIcon src={supportIcon} alt="Support" />
                  <h3>Support</h3>
                  <p>Our team is always here to help you with any questions or issues.</p>
                </FeatureCard>
              </FeaturesGrid>
            </SectionContent>
          </Section>
    
          {/* Testimonials Carousel */}
          <TestimonialSection>
            <SectionContent className="animate-content" style={{ transitionDelay: '0.4s' }}>
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
            <CTAContent className="animate-content" style={{ transitionDelay: '0.5s' }}>
              <CenteredHeading>Ready to Transform Your Photos?</CenteredHeading>
              <CTAButton to="/edit-photo">
                <span>Start Creating Now</span>
                <svg className="arrow-icon" viewBox="0 0 16 19" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" />
                </svg>
              </CTAButton>
            </CTAContent>
          </CTASection>
        </AboutContainer>
      );
    }

// Add these new styled components
const CenteredHeading = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: #ff69b4;
  position: relative;
  
  &::after {
    content: '';
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

// Update TestimonialSection styled component
const TestimonialSection = styled.section`
  padding: 80px 0;
  background-color: #fff0f5;
  margin-bottom: 40px; /* Added margin to create space before CTA */
`;

// Update TestimonialCarousel styled component
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

// Update TestimonialCard styled component
const TestimonialCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 105, 180, 0.2);
  min-height: 250px;
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
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff69b4;
  position: relative;
  overflow: hidden;
  margin-bottom: 80px;
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: 4.5rem;
    margin-bottom: 20px;
    font-weight: 800;
  }

  .subtitle {
    font-size: 1.8rem;
    opacity: 0.9;
  }
`;

const Section = styled.section`
  padding: 80px 0;
  background-color: #fff0f5;
  margin-bottom: 40px;
  position: relative;
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
  text-align: justify;       // Aliniere pe ambele margini
  hyphens: manual;           // Dezactivează despărțirea automată
  word-spacing: normal;      // Resetează spațierea cuvintelor

  p {
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    text-align: left;        // Pe mobil revenim la aliniere stânga
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
  background: white;
  border-radius: 15px;
  padding: 40px 30px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #ff69b4;
    margin: 25px 0 15px;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const FeatureIcon = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 0 auto;
`;

const CTASection = styled.section`
  padding: 100px 0;
  background-color: #ffcccb;
  text-align: center;
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
    content: '';
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

export default About;