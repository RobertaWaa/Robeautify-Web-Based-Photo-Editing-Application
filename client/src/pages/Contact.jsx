import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import SendMessageButton from '../components/SendMessageButton';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Acesta era lipsă
    const [error, setError] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-element');
                }
            });
        }, { threshold: 0.1 });

        const animatedElements = document.querySelectorAll('.animate-contact');
        animatedElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
    
            // Afișează răspunsul brut pentru debugging
            const responseText = await response.text();
            console.log('Raw server response:', responseText);
            
            // Parsează JSON-ul
            const result = JSON.parse(responseText);
            
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Eroare la trimiterea mesajului');
            }
            
            console.log('Success:', result);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setError(error.message);
            console.error('Error details:', {
                error: error,
                formData: formData
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ContactSection className="contact-section">
            <div className="contact-container">
                <h2 className="contact-heading animate-contact">Get In Touch</h2>
                
                <div className="contact-grid">
                    <div className="contact-info animate-contact" style={{ transitionDelay: '0.1s' }}>
                        <h3 style={{ textAlign: 'center' }}>Contact Information</h3>
                        <p style={{ textAlign: 'center' }}>If you have any questions or need assistance, feel free to reach out to us!</p>
                        
                        <div className="contact-details">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h4>Email</h4>
                                    <p>robeautify@gmail.com</p>
                                </div>
                            </div>
                            
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaPhoneAlt />
                                </div>
                                <div>
                                    <h4>Phone</h4>
                                    <p>+40 123 456 789</p>
                                </div>
                            </div>
                            
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h4>Address</h4>
                                    <p>Bucharest, Romania</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="contact-form animate-contact" style={{ transitionDelay: '0.2s' }}>
                        <h3 style={{ textAlign: 'center' }}>Send Us a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    placeholder="ex. John Smith"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="ex. email@gmail.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="subject" className="form-label">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="form-control"
                                    placeholder="ex. Question about editing features"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="message" className="form-label">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-control"
                                    placeholder="ex. Hello, I have a question about..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            
                            <div style={{ textAlign: 'center', marginTop: '25px', padding: '0 20px' }}>
                                <SendMessageButton onClick={handleSubmit} disabled={isSubmitting} />
                            </div>
                            
                            {isSubmitted && (
                                <SuccessMessage>
                                    Thank you! Your message has been sent.
                                </SuccessMessage>
                            )}
                        </form>

                        {error && (
                            <div className="alert alert-danger mt-3">
                                {error}
                            </div>
                        )}
                        
                        {isSubmitting && (
                            <div className="text-center mt-3">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Se trimite...</span>
                                </div>
                                <p>Se trimite mesajul...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ContactSection>
    );
};

// Styled components
const ContactSection = styled.section`
    padding: 80px 0;
    background-color: #fff0f5;

    .contact-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .contact-heading {
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
    }

    .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 40px;
    }

    .contact-info {
        background: white;
        border-radius: 15px;
        padding: 40px;
        box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);

        h3 {
            color: #ff69b4;
            margin-bottom: 20px;
            font-size: 1.5rem;
            text-align: center;
        }

        p {
            text-align: center;
        }
    }

    .contact-details {
        margin-top: 30px;
    }

    .contact-item {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
    }

    .contact-icon {
        width: 40px;
        height: 40px;
        background-color: #ffcccb;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: #ff69b4;
        font-size: 18px;
    }

    .contact-form {
        background: white;
        border-radius: 15px;
        padding: 40px;
        box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);

        h3 {
            text-align: center;
        }
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-label {
        display: block;
        margin-bottom: 8px;
        color: #555;
        font-weight: 500;
    }

    .form-control {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
        transition: all 0.3s;

        &:focus {
            border-color: #ff69b4;
            box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
            outline: none;
        }

        &::placeholder {
            color: #aaa;
            font-style: italic;
        }
    }

    textarea.form-control {
        min-height: 150px;
        resize: vertical;
    }

    .submit-btn-container {
        text-align: center;
        margin-top: 20px;
    }

    /* Animation */
    .animate-contact {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease-out;

        &.show-element {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        padding: 60px 0;
        
        .contact-heading {
            font-size: 2rem;
        }
        
        .contact-info, .contact-form {
            padding: 30px;
        }
    }
`;

const SuccessMessage = styled.p`
    margin-top: 20px;
    color: #28a745;
    font-weight: 500;
    text-align: center;
    animation: fadeIn 0.5s ease-in-out;

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

export default Contact;