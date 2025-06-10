import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation checks - identical to signup
  const passwordChecks = {
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    specialChar: /[^A-Za-z0-9]/.test(newPassword),
  };

  // Check if passwords match
  const passwordsMatch = newPassword === confirmPassword && newPassword !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password requirements - identical to signup
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: searchParams.get("token"),
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }

      setMessage(result.message || "Password has been reset successfully!");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const token = searchParams.get("token");
  if (!token) {
    return (
      <Container>
        <FormContainer>
          <Title>Invalid Reset Link</Title>
          <ErrorMessage>
            The password reset link is invalid or has expired.
          </ErrorMessage>
          <Link
            to="/forgot-password"
            style={{
              color: "#ff69b4",
              marginTop: "20px",
              display: "inline-block",
            }}
          >
            Request a new reset link
          </Link>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FormContainer>
        <BackButton to="/login">
          <FaArrowLeft />
        </BackButton>

        <Title>Reset Your Password</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <SuccessMessage>{message}</SuccessMessage>}

        {!message && (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="newPassword">Password</label>
              <InputWrapper>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
                <TogglePassword
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </TogglePassword>
              </InputWrapper>

              {newPassword.length > 0 && newPassword.length < 8 && (
                <FieldError>Password must be at least 8 characters</FieldError>
              )}

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
            </FormGroup>

            <FormGroup>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <InputWrapper>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
                <TogglePassword
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </TogglePassword>
              </InputWrapper>

              {confirmPassword && (
                <PasswordMatchIndicator $match={passwordsMatch}>
                  {passwordsMatch
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </PasswordMatchIndicator>
              )}
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </SubmitButton>
          </Form>
        )}

        {message && (
          <Link
            to="/login"
            style={{
              color: "#ff69b4",
              marginTop: "20px",
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            Back to Login
          </Link>
        )}
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

const Title = styled.h2`
  color: #ff69b4;
  margin-bottom: 20px;
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
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    border-color: #ff69b4;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
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

const PasswordRequirements = styled.div`
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
  color: ${(props) => (props.$match ? "#28a745" : "#dc3545")};
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
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
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

export default ResetPassword;
