import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send reset link");
      }

      setMessage(
        result.message || "Password reset link has been sent to your email!"
      );
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <BackButton to="/login">
          <FaArrowLeft />
        </BackButton>

        <h2>
          <FaEnvelope /> Reset Password
        </h2>
        <p>Enter your email address to receive a password reset link</p>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <SuccessMessage>{message}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">Email Address</label>
            <InputWrapper>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex. email@example.com"
                required
              />
            </InputWrapper>
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </SubmitButton>
        </Form>

        <div style={{ marginTop: "20px", color: "#666" }}>
          Back to{" "}
          <Link to="/login" style={{ color: "#ff69b4" }}>
            login page
          </Link>
        </div>
      </FormContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(45deg, #ffcccb, #ff69b4);
  padding: 20px;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;

  h2 {
    color: #ff69b4;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  p {
    color: #666;
    margin-bottom: 30px;
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #ff69b4;
  font-size: 1.2rem;

  &:hover {
    color: #ff1493;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  text-align: left;

  label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    border-color: #ff69b4;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
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
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`;

const SuccessMessage = styled(Message)`
  color: #28a745;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
`;

const ErrorMessage = styled(Message)`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
`;

export default ForgotPassword;
