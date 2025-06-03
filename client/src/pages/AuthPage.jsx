// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function AuthPage({ type }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Password validation checks
    const passwordChecks = {
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        specialChar: /[^A-Za-z0-9]/.test(formData.password)
    };

    // Check if passwords match
    const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== '';

    const validate = () => {
  const newErrors = {};
  
  if (type === 'signup') {
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!passwordsMatch) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
  } else {
    // Login validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

    const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) {
    console.log('Validation failed');
    return;
  }

  setIsSubmitting(true);
  setErrors({});
  
  try {
    let payload;
    let endpoint;
    
    if (type === 'signup') {
      payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      endpoint = '/api/signup';
    } else {
      // This is the login payload - make sure it matches your backend
      payload = {
        email: formData.email,
        password: formData.password
      };
      endpoint = '/api/login'; // Make sure this is correct
    }

    console.log('Sending payload:', payload); // Debug log

    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    console.log('API Response:', result); // Debug log
    
    if (!response.ok) {
      if (result.field) {
        setErrors({ [result.field]: result.message });
      } else {
        setErrors({ form: result.error || 'Authentication error' });
      }
      return;
    }
    
    if (result.success) {
      await login(result.user, result.token);
      navigate('/my-account');
    }
  } catch (error) {
    console.error('API Error:', error);
    setErrors({ form: 'An error occurred. Please try again later.' });
  } finally {
    setIsSubmitting(false);
  }
};

    const handleGoogleSuccess = async (credentialResponse) => {
  if (type === 'signup' && !agreeToTerms) {
    setErrors({ form: 'You must agree to the Terms of Service and Privacy Policy' });
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/google-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        credential: credentialResponse.credential,
        clientId: credentialResponse.clientId
      })
    });

    
    const result = await response.json();
    
    if (result.success) {
      await login(result.user, result.token);
      navigate('/my-account');
    } else {
      setErrors({ form: result.error || 'Google authentication failed' });
    }
  } catch (error) {
    setErrors({ form: 'Google authentication error' });
  }
};

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const checkUsernameAvailability = async (username) => {
        if (!username || username.length < 3) return;
        
        try {
            const response = await fetch(`http://localhost:5000/api/check-username?username=${encodeURIComponent(username)}`);
            const data = await response.json();
            
            if (!data.available) {
                setErrors(prev => ({ 
                    ...prev, 
                    username: 'This username is already taken. Please choose another one.' 
                }));
            } else if (errors.username && data.available) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.username;
                    return newErrors;
                });
            }
        } catch (error) {
            console.error('Availability check error:', error);
        }
    };

    return (
        <AuthContainer>
            <AuthCard>
                <Logo>Robeautify<span>.</span></Logo>
                <h2>{type === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
                
                {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
                
                <AuthForm onSubmit={handleSubmit}>
                    {type === 'signup' ? (
  <>
    <FormGroup>
      <label htmlFor="name">Full Name</label>
      <InputWrapper>
        <InputField
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
        />
      </InputWrapper>
      {errors.name && <FieldError>{errors.name}</FieldError>}
    </FormGroup>
    
    <FormGroup>
      <label htmlFor="email">Email</label>
      <InputWrapper>
        <InputField
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="your@email.com"
        />
      </InputWrapper>
      {errors.email && <FieldError>{errors.email}</FieldError>}
    </FormGroup>
  </>
) : (
                        <FormGroup>
                            <label htmlFor="email">Email</label>
    <InputWrapper>
      <InputField
        type="email"
        id="email"
        name="email"
        value={formData.email || ''}
        onChange={handleChange}
        placeholder="your@email.com"
      />
    </InputWrapper>
    {errors.email && <FieldError>{errors.email}</FieldError>}
                        </FormGroup>
                    )}
                    
                    <FormGroup>
                        <label htmlFor="password">Password</label>
                        <InputWrapper>
                            <InputField
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                            <TogglePassword 
                                type="button" 
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </TogglePassword>
                        </InputWrapper>
                        {errors.password && <FieldError>{errors.password}</FieldError>}
                           
    
    {type === 'login' && (
        <ForgotPasswordLink>
            <Link to="/forgot-password">Forgot password?</Link>
        </ForgotPasswordLink>
    )}
                        
                        {type === 'signup' && (
    <PasswordRequirements>
        <div>
            {passwordChecks.uppercase ? (
                <RequirementMet>✓ Uppercase letter</RequirementMet>
            ) : (
                <RequirementUnmet>✗ Uppercase letter</RequirementUnmet>
            )}
        </div>
        <div>
            {passwordChecks.lowercase ? (
                <RequirementMet>✓ Lowercase letter</RequirementMet>
            ) : (
                <RequirementUnmet>✗ Lowercase letter</RequirementUnmet>
            )}
        </div>
        <div>
            {passwordChecks.number ? (
                <RequirementMet>✓ Number</RequirementMet>
            ) : (
                <RequirementUnmet>✗ Number</RequirementUnmet>
            )}
        </div>
        <div>
            {passwordChecks.specialChar ? (
                <RequirementMet>✓ Special character</RequirementMet>
            ) : (
                <RequirementUnmet>✗ Special character</RequirementUnmet>
            )}
        </div>
    </PasswordRequirements>
)}
                    </FormGroup>
                    
                    {type === 'signup' && (
                        <FormGroup>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <InputWrapper>
                                <InputField
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                />
                                <TogglePassword 
                                    type="button" 
                                    onClick={toggleConfirmPasswordVisibility}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </TogglePassword>
                            </InputWrapper>
                            {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
                            
                            {formData.confirmPassword && (
                                <PasswordMatchIndicator $match={passwordsMatch}>
                                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                                </PasswordMatchIndicator>
                            )}
                        </FormGroup>
                    )}
                    
                    {type === 'signup' && (
  <TermsCheckbox>
    <input 
      type="checkbox" 
      id="agreeToTerms"
      checked={agreeToTerms}
      onChange={(e) => setAgreeToTerms(e.target.checked)}
    />
    <label htmlFor="agreeToTerms">
      I agree to the <Link to="/terms-of-service">Terms of Service</Link> and{' '}
      <Link to="/privacy-policy">Privacy Policy</Link>
    </label>
  </TermsCheckbox>
)}

<SubmitButton 
  type="submit" 
  disabled={isSubmitting || (type === 'signup' && !agreeToTerms)}
>
  {isSubmitting ? 'Processing...' : type === 'login' ? 'Log In' : 'Sign Up'}
</SubmitButton>
                </AuthForm>
                
                <Divider><span>OR</span></Divider>
                
                <GoogleButtonContainer>
                    <GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => setErrors({ form: 'Google login failed' })}
  useOneTap
  auto_select
  ux_mode="popup" // Add this line
  cookiePolicy="single_host_origin" // Add this line
/>
                </GoogleButtonContainer>
                
                <AuthLink>
                    {type === 'login' ? (
                        <>Don't have an account? <Link to="/signup">Sign up</Link></>
                    ) : (
                        <>Already have an account? <Link to="/login">Log in</Link></>
                    )}
                </AuthLink>
            </AuthCard>
        </AuthContainer>
    );
}

const AuthContainer = styled.div`
    display: flex;
    min-height: 100vh;
    background: linear-gradient(45deg, #ffcccb, #ff69b4);
    padding: 40px 20px;
`;

const AuthCard = styled.div`
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(255, 105, 180, 0.2);
    padding: 40px;
    width: 100%;
    max-width: 500px;
    margin: auto;
    text-align: center;
`;

const Logo = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    color: #ff69b4;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    span {
        color: #333;
    }
`;

const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const FormGroup = styled.div`
    text-align: left;
    position: relative;
    
    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #555;
    }
`;

const InputWrapper = styled.div`
    position: relative;
`;

const InputField = styled.input`
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
    padding-right: 40px;
    
    &:focus {
        border-color: #ff69b4;
        box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
        outline: none;
    }
`;

const TogglePassword = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #777;
    cursor: pointer;
    padding: 5px;
    
    &:hover {
        color: #ff69b4;
    }
`;

const PasswordRequirements = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 8px;
  font-size: 0.85rem;
  color: #666;
  
  div {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
`;

const RequirementMet = styled.span`
    color: #28a745;
`;

const RequirementUnmet = styled.span`
    color: #dc3545;
`;

const PasswordMatchIndicator = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  color: ${props => props.$match ? '#28a745' : '#dc3545'};
`;

const SubmitButton = styled.button`
    background-color: #ff69b4;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    margin-top: 10px;
    
    &:hover {
        background-color: #ff1493;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 105, 180, 0.3);
    }
    
    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const Divider = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;
    color: #777;
    
    &::before, &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #ddd;
    }
    
    span {
        padding: 0 15px;
    }
`;

const AuthLink = styled.div`
    margin-top: 20px;
    color: #555;
    
    a {
        color: #ff69b4;
        font-weight: 500;
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

const ErrorMessage = styled.div`
    color: #d32f2f;
    background-color: #ffebee;
    border: 1px solid #ef9a9a;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 0.95rem;
    text-align: center;
`;

const FieldError = styled.div`
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 5px;
    padding: 5px;
    background-color: #f8d7da;
    border-radius: 4px;
    border-left: 3px solid #dc3545;
    animation: fadeIn 0.3s ease-out;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const GoogleButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const AvailabilityMessage = styled.div`
    color: ${props => props.$available ? '#28a745' : '#dc3545'};
    font-size: 0.75rem;
    margin-top: 5px;
    animation: fadeIn 0.3s ease-out;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const ForgotPasswordLink = styled.div`
    text-align: right;
    margin-top: 5px;       
    margin-bottom: 0px;   
    
    a {
        color: #ff69b4;
        font-size: 0.9rem;
        text-decoration: none;
        
        &:hover {
            text-decoration: underline;
        }
    }
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  font-size: 0.9rem;
  color: #555;

  input {
    margin-right: 10px;
    accent-color: #ff69b4;
  }

  a {
    color: #ff69b4;
    text-decoration: none;
    margin: 0 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default AuthPage;