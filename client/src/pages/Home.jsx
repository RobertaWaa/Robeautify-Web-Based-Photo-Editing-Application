import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import easyToUseImage from '../assets/images/easy-to-use.png';
import creativeFiltersImage from '../assets/images/creative-filters.png';
import itsFreeImage from '../assets/images/its-free.png';
import deviceMockup from '../assets/images/device-mockup.png';
import JoinNowButton from '../components/JoinNowButton';
import '../assets/styles/home.css';

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

    // Animatie la scroll doar pentru elemente specifice
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-element');
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div>
            {/* Welcome Section */}
            <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(45deg, #ffcccb, #ff69b4)' }}>
                <h1 className="display-2 text-white animate-on-scroll">Filter, edit, shine.</h1>
                <h2 className="text-white mb-4 animate-on-scroll" style={{ fontSize: '2.5rem' }}>Robeautify.</h2>
                <p className="lead text-white text-center mb-5 animate-on-scroll" style={{ fontSize: '1.5rem' }}>
                    Transform your photos into stunning works of art with just a few clicks.<br />
                    Enjoy simple, intuitive, and professional editing tools designed for everyone.
                </p>
                <StyledWrapper className="animate-on-scroll">
                    <Link to="/edit-photo" id="btn">Start Editing Now</Link>
                </StyledWrapper>
            </div>

            {/* How It Works Section with Bottom Wave */}
            <div className="shapedividers_com-9676" style={{ 
                position: 'relative',
                background: 'linear-gradient(45deg, #ffcccb, #ff69b4)',
                padding: '100px 0 120px'
            }}>
                <div className="text-center" style={{ position: 'relative', zIndex: 4 }}>
                    <h2 className="text-white mb-5 animate-on-scroll" style={{ fontSize: '2.5rem' }}>How it works?</h2>
                    <StyledCards>
                        <div className="cards">
                            <div className="card animate-on-scroll">
                                <p className="tip">1</p>
                                <p className="second-text">Bring your memories to life!</p>
                                <p className="second-text">Upload your photo and get ready to turn it into something amazing.</p>
                            </div>
                            <div className="card animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                                <p className="tip">2</p>
                                <p className="second-text">Unleash your creativity!</p>
                                <p className="second-text">Use our powerful tools to adjust lighting, colors, and details.</p>
                            </div>
                            <div className="card animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
                                <p className="tip">3</p>
                                <p className="second-text">Ready to shine?</p>
                                <p className="second-text">Save your edited photo and share it with the world. Be proud of the result!</p>
                            </div>
                        </div>
                    </StyledCards>
                </div>
            </div>

            {/* Carousel Section */}
            <div className="text-center py-5" style={{ 
                background: '#fff0f5', 
                padding: '100px 0',
                marginTop: '-1px'
            }}>
                <h2 className="text-dark mb-5 animate-on-scroll" style={{ fontSize: '2.5rem' }}>The magic of editing at your fingertips</h2>
                <StyledCarousel>
                    <Slider {...settings}>
                        <div className="slide animate-on-scroll">
                            <img src={easyToUseImage} alt="Easy-to-use Interface" className="slide-image" />
                            <p className="slide-title">Easy-to-use Interface</p>
                            <p className="slide-text">Intuitive tools for seamless editing.</p>
                        </div>
                        <div className="slide animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                            <img src={creativeFiltersImage} alt="Creative Filters" className="slide-image" />
                            <p className="slide-title">Creative Filters</p>
                            <p className="slide-text">Choose from a vast selection of filters to give your photos a unique look.</p>
                        </div>
                        <div className="slide animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
                            <img src={itsFreeImage} alt="It's free" className="slide-image" />
                            <p className="slide-title">It's free</p>
                            <p className="slide-text">Anyone can use it anytime for free!</p>
                        </div>
                    </Slider>
                </StyledCarousel>
            </div>

{/* Join Community Section with New Wave Dividers */}
<div className="join-community-section" style={{ 
    position: 'relative',
    background: 'linear-gradient(45deg, #ffcccb, #ff69b4)',
    padding: '120px 0 100px',
    marginTop: '-1px'
}}>
    {/* Top Wave */}
    <div className="wave-top"></div>
    
    <div className="text-center" style={{ position: 'relative', zIndex: 4 }}>
        <h2 className="text-white mb-4 animate-on-scroll" style={{ fontSize: '2.5rem' }}>Join Our Creative Community</h2>
        <div className="animate-on-scroll">
            <JoinNowButton />
        </div>
    </div>
    
    {/* Bottom Wave */}
    <div className="wave-bottom"></div>
</div>

            {/* Multi-Device Section (after Join Community) */}
            <div className="text-center py-5" style={{ 
                background: '#fff0f5', 
                padding: '100px 0'
            }}>
                <div className="container">
                    <h2 className="text-dark mb-4 animate-on-scroll" style={{ fontSize: '2.5rem' }}>Available on both Mobile & Web</h2>
                    <p className="lead text-dark mb-5 animate-on-scroll" style={{ fontSize: '1.5rem' }}>
                        Enjoy creative freedom anywhere, anytime!
                    </p>
                    <div className="animate-on-scroll" style={{ transitionDelay: '0.3s' }}>
                        <img 
                            src={deviceMockup} 
                            alt="Mobile and Web App Mockups" 
                            style={{ 
                                maxWidth: '800px', 
                                width: '100%', 
                                height: 'auto',
                                margin: '0 auto'
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* Global Styles and Animations */}
            <style jsx="true">{`
                /* Wave Dividers */
                .shapedividers_com-9676 {
                    overflow: hidden;
                    position: relative;
                }
                .shapedividers_com-9676::before {
                    content: '';
                    font-family: 'shape divider from ShapeDividers.com';
                    position: absolute;
                    z-index: 3;
                    pointer-events: none;
                    background-repeat: no-repeat;
                    bottom: -0.1vw;
                    left: -0.1vw;
                    right: -0.1vw;
                    top: -0.1vw;
                    background-size: 100% 85px;
                    background-position: 50% 100%;
                    background-image: url('data:image/svg+xml;charset=utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.28 2.17" preserveAspectRatio="none"><path d="M35.28 1.67c-3.07-.55-9.27.41-16.15 0-6.87-.4-13.74-.58-19.13.1v.4h35.28z" fill="%23fff0f5"/><path d="M35.28 1.16c-3.17-.8-7.3.4-10.04.56-2.76.17-9.25-1.47-12.68-1.3-3.42.16-4.64.84-7.04.86C3.12 1.31 0 .4 0 .4v1.77h35.28z" opacity=".5" fill="%23fff0f5"/><path d="M35.28.31c-2.57.84-7.68.3-11.8.43-4.1.12-6.85.61-9.57.28C11.18.69 8.3-.16 5.3.02 2.3.22.57.85 0 .87v1.2h35.28z" opacity=".5" fill="%23fff0f5"/></svg>');
                }
                
                .shapedividers_com-1304 {
                    overflow: hidden;
                    position: relative;
                }
                .shapedividers_com-1304::before {
                    content: '';
                    font-family: 'shape divider from ShapeDividers.com';
                    position: absolute;
                    z-index: 3;
                    pointer-events: none;
                    background-repeat: no-repeat;
                    bottom: -0.1vw;
                    left: -0.1vw;
                    right: -0.1vw;
                    top: -0.1vw;
                    background-size: 100% 85px;
                    background-position: 50% 0%;
                    background-image: url('data:image/svg+xml;charset=utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.28 2.17" preserveAspectRatio="none"><path d="M0 .5c3.07.55 9.27-.42 16.14 0 6.88.4 13.75.57 19.14-.11V0H0z" fill="%23fff0f5"/><path d="M0 1c3.17.8 7.29-.38 10.04-.55 2.75-.17 9.25 1.47 12.67 1.3 3.43-.17 4.65-.84 7.05-.87 2.4-.02 5.52.88 5.52.88V0H0z" opacity=".5" fill="%23fff0f5"/><path d="M0 1.85c2.56-.83 7.68-.3 11.79-.42 4.1-.12 6.86-.61 9.58-.28 2.73.33 5.61 1.17 8.61 1 3-.19 4.73-.82 5.3-.84V.1H0z" opacity=".5" fill="%23fff0f5"/></svg>');
                }

                @media (min-width: 2100px) {
                    .shapedividers_com-9676::before,
                    .shapedividers_com-1304::before {
                        background-size: 100% calc(2vw + 85px);
                    }
                }

                /* Top Wave Divider */
    .wave-top {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 90px;
    z-index: 3;
    pointer-events: none;
}

.wave-top::before {
    content: '';
    font-family: 'shape divider from ShapeDividers.com';
    position: absolute;
    bottom: -1px;
    left: -1px;
    right: -1px;
    top: -1px;
    background-repeat: no-repeat;
    background-size: 100% 90px;
    background-position: 50% 0%;
    background-image: url('data:image/svg+xml;charset=utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.28 2.17" preserveAspectRatio="none"><path d="M0 .5c3.07.55 9.27-.42 16.14 0 6.88.4 13.75.57 19.14-.11V0H0z" fill="%23fbd8c2"/><path d="M0 1c3.17.8 7.29-.38 10.04-.55 2.75-.17 9.25 1.47 12.67 1.3 3.43-.17 4.65-.84 7.05-.87 2.4-.02 5.52.88 5.52.88V0H0z" opacity=".5" fill="%23fbd8c2"/><path d="M0 1.85c2.56-.83 7.68-.3 11.79-.42 4.1-.12 6.86-.61 9.58-.28 2.73.33 5.61 1.17 8.61 1 3-.19 4.73-.82 5.3-.84V.1H0z" opacity=".5" fill="%23fbd8c2"/></svg>');
}

.wave-bottom {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    z-index: 3;
    pointer-events: none;
}

.wave-bottom::before {
    content: '';
    font-family: 'shape divider from ShapeDividers.com';
    position: absolute;
    bottom: -1px;
    left: -1px;
    right: -1px;
    top: -1px;
    background-repeat: no-repeat;
    background-size: 100% 90px;
    background-position: 50% 100%;
    transform: rotateY(180deg);
    background-image: url('data:image/svg+xml;charset=utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"><path fill="%23fff0f5" d="M0 288l1440-128v160H0z"/><path fill="%23fff0f5" opacity=".66" d="M0 192l1440-96v224H0z"/></svg>');
}

@media (min-width:768px) {
    .wave-top::before,
    .wave-bottom::before {
        background-size: 100% 90px;
    }
}

@media (min-width:1025px) {
    .wave-top::before {
        background-size: 100% 84px;
        background-position: 50% 0%;
        background-image: url('data:image/svg+xml;charset=utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.28 2.17" preserveAspectRatio="none"><path d="M0 .5c3.07.55 9.27-.42 16.14 0 6.88.4 13.75.57 19.14-.11V0H0z" fill="%23fff0f5"/><path d="M0 1c3.17.8 7.29-.38 10.04-.55 2.75-.17 9.25 1.47 12.67 1.3 3.43-.17 4.65-.84 7.05-.87 2.4-.02 5.52.88 5.52.88V0H0z" opacity=".5" fill="%23fff0f5"/><path d="M0 1.85c2.56-.83 7.68-.3 11.79-.42 4.1-.12 6.86-.61 9.58-.28 2.73.33 5.61 1.17 8.61 1 3-.19 4.73-.82 5.3-.84V.1H0z" opacity=".5" fill="%23fff0f5"/></svg>');
    }
    
    .wave-bottom::before {
        background-size: 100% 84px;
    }
}

@media (min-width:2100px) {
    .wave-top::before,
    .wave-bottom::before {
        background-size: 100% calc(2vw + 84px);
    }
}

.join-community-section {
    overflow: hidden;
    position: relative;
}

                /* Scroll Animations for individual elements */
                .animate-on-scroll {
                    opacity: 0;
                    filter: blur(5px);
                    transform: translateY(20px);
                    transition: all 0.8s ease-out;
                }

                .animate-on-scroll.show-element {
                    opacity: 1;
                    filter: blur(0);
                    transform: translateY(0);
                }

                @media(prefers-reduced-motion) {
                    .animate-on-scroll {
                        transition: none;
                        opacity: 1;
                        filter: blur(0);
                        transform: none;
                    }
                }
            `}</style>
        </div>
    );
}

/* Styled components remain the same */
const StyledWrapper = styled.div`
  a {
    padding: 15px 30px;
    text-transform: uppercase;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 500;
    color: #ffffff80;
    text-shadow: none;
    background: transparent;
    cursor: pointer;
    box-shadow: transparent;
    border: 1px solid #ffffff80;
    transition: 0.5s ease;
    user-select: none;
    text-decoration: none;
  }

  #btn:hover,
  #btn:focus {
    color: #ffffff;
    background: #ff69b4;
    border: 1px solid #ff69b4;
    text-shadow: 0 0 5px #ffffff, 0 0 10px #ffffff, 0 0 20px #ffffff;
    box-shadow: 0 0 5px #ff69b4, 0 0 20px #ff69b4, 0 0 50px #ff69b4,
      0 0 100px #ff69b4;
  }
`;

const StyledCards = styled.div`
  .cards {
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }

  .cards .card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    height: 200px;
    width: 100%;
    max-width: 600px;
    border-radius: 10px;
    background-color: #ff69b4;
    color: white;
    cursor: pointer;
    transition: 400ms;
    padding: 20px;
  }

  .cards .card p.tip {
    font-size: 1.5em;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .cards .card p.second-text {
    font-size: 1.1em;
    margin: 5px 0;
  }

  .cards .card:hover {
    transform: scale(1.05, 1.05);
  }

  .cards .card:hover ~ .card {
    filter: blur(5px);
    transform: scale(0.95, 0.95);
  }
`;

const StyledCarousel = styled.div`
  .slick-slider {
    max-width: 800px;
    margin: 0 auto;
  }

  .slide {
    padding: 20px;
    text-align: center;
  }

  .slide-image {
    width: 100px;
    height: auto;
    margin: 0 auto 15px;
    display: block;
    object-fit: contain;
  }

  .slide-title {
    font-size: 1.5em;
    font-weight: 700;
    color: #ff69b4;
    margin-bottom: 8px;
  }

  .slide-text {
    font-size: 1.1em;
    color: #333;
    max-width: 80%;
    margin: 0 auto;
  }

  .slick-prev, .slick-next {
    width: 40px;
    height: 40px;
    z-index: 2;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    border: 2px solid #ff69b4;

    &:before {
      color: #ff69b4;
      font-size: 20px;
      opacity: 1;
      transition: all 0.3s ease;
    }

    &:hover {
      background: #ff69b4;
      border-color: #ff69b4;

      &:before {
        color: white;
      }
    }
  }

  .slick-prev {
    left: -50px;
  }
  
  .slick-next {
    right: -50px;
  }

  .slick-dots li button:before {
    font-size: 12px;
    color: #ff69b4;
  }

  .slick-dots li.slick-active button:before {
    color: #ff69b4;
  }
`;

export default Home;