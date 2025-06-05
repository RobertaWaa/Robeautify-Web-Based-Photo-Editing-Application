import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaEdit,
  FaSignOutAlt,
  FaTimesCircle,
  FaImage,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function MyAccount() {
  const { currentUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editedPhotos, setEditedPhotos] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation checks
  const passwordChecks = {
    uppercase: /[A-Z]/.test(formData.newPassword),
    lowercase: /[a-z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    specialChar: /[^A-Za-z0-9]/.test(formData.newPassword),
  };

  // Check if passwords match
  const passwordsMatch =
    formData.newPassword === formData.confirmPassword &&
    formData.newPassword !== "";

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setFormData({
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      newPassword: "",
      confirmPassword: "",
    });

    // Fetch user's edited photos
    const fetchEditedPhotos = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user-photos?userId=${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setEditedPhotos(data.photos);
        } else {
          setError(data.error || "Failed to load photos");
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        setError("Failed to load your photo gallery. Please try again later.");
      }
    };

    fetchEditedPhotos();
  }, [currentUser?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        email: formData.email,
        fullName: formData.fullName,
        ...(formData.newPassword && { newPassword: formData.newPassword }),
      };

      const response = await fetch("http://localhost:5000/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      // Only require email verification if email was changed
      const needsVerification = currentUser.email !== formData.email;

      updateUser({
        ...result.user,
        emailVerified: needsVerification ? false : currentUser.emailVerified,
      });

      setEditMode(false);
      setSuccess(
        needsVerification
          ? "Profile updated successfully! Please verify your new email address."
          : "Profile updated successfully!"
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const resendVerificationEmail = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/resend-verification",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess(
          "Verification email has been resent. Please check your inbox."
        );
      } else {
        setError(result.error || "Failed to resend verification email");
      }
    } catch (error) {
      console.error("Error resending verification email:", error);
      setError("An error occurred while resending the verification email");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!currentUser) return null;

  return (
    <AccountContainer>
      <AccountHeader>
        <h1>My Account</h1>
        <p>Manage your profile and view your edited photos</p>
      </AccountHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <AccountContent>
        <DetailsSection>
          <SectionHeader>
            <h2>Profile Details</h2>
            {!editMode ? (
              <EditButton onClick={() => setEditMode(true)}>
                <FaEdit />
              </EditButton>
            ) : null}
          </SectionHeader>

          {editMode ? (
            <form onSubmit={handleSubmit}>
              <DetailItem>
                <FaUser />
                <div>
                  <h3>Full Name</h3>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <FieldError>{errors.fullName}</FieldError>
                  )}
                </div>
              </DetailItem>

              <DetailItem>
                <FaEnvelope />
                <div>
                  <h3>Email</h3>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </div>
              </DetailItem>

              <DetailItem>
                <FaUser />
                <div>
                  <h3>New Password</h3>
                  <PasswordInputContainer>
                    <PasswordInputField
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                    />
                    <PasswordToggleButton
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </PasswordToggleButton>
                  </PasswordInputContainer>
                  {errors.newPassword && (
                    <FieldError>{errors.newPassword}</FieldError>
                  )}

                  {formData.newPassword && (
                    <PasswordRequirements>
                      <div>
                        {passwordChecks.uppercase ? (
                          <RequirementMet>✓ Uppercase letter</RequirementMet>
                        ) : (
                          <RequirementUnmet>
                            ✗ Uppercase letter
                          </RequirementUnmet>
                        )}
                      </div>
                      <div>
                        {passwordChecks.lowercase ? (
                          <RequirementMet>✓ Lowercase letter</RequirementMet>
                        ) : (
                          <RequirementUnmet>
                            ✗ Lowercase letter
                          </RequirementUnmet>
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
                          <RequirementUnmet>
                            ✗ Special character
                          </RequirementUnmet>
                        )}
                      </div>
                    </PasswordRequirements>
                  )}
                </div>
              </DetailItem>

              <DetailItem>
                <FaUser />
                <div>
                  <h3>Confirm Password</h3>
                  <PasswordInputContainer>
                    <PasswordInputField
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                    />
                    <PasswordToggleButton
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </PasswordToggleButton>
                  </PasswordInputContainer>
                  {errors.confirmPassword && (
                    <FieldError>{errors.confirmPassword}</FieldError>
                  )}

                  {formData.confirmPassword && (
                    <PasswordMatchIndicator $match={passwordsMatch}>
                      {passwordsMatch
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </PasswordMatchIndicator>
                  )}
                </div>
              </DetailItem>

              <ActionButtons>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <FaEdit /> Save Changes
                    </>
                  )}
                </button>
                <button type="button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </ActionButtons>
            </form>
          ) : (
            <>
              <DetailItem>
                <FaUser />
                <div>
                  <h3>Full Name</h3>
                  <p>{formData.fullName || "Not set yet"}</p>
                </div>
              </DetailItem>

              <DetailItem>
                <FaEnvelope />
                <div>
                  <h3>Email</h3>
                  <p>{formData.email}</p>
                  {!currentUser.emailVerified && (
                    <VerificationMessage>
                      <FaTimesCircle /> Email not verified.
                      <ResendButton onClick={resendVerificationEmail}>
                        Resend verification
                      </ResendButton>
                    </VerificationMessage>
                  )}
                </div>
              </DetailItem>

              <DetailItem>
                <FaCalendarAlt />
                <div>
                  <h3>Member Since</h3>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </DetailItem>

              <ActionButtons>
                <button onClick={handleLogout}>
                  <FaSignOutAlt /> Log Out
                </button>
              </ActionButtons>
            </>
          )}
        </DetailsSection>

        <GallerySection>
          <GalleryHeader>Your Photo Gallery</GalleryHeader>
          {editedPhotos.length > 0 ? (
            <GalleryGrid>
              {editedPhotos.map((photo, index) => (
                <GalleryItem key={index}>
                  <img
                    src={`/uploads/${photo.filename}`}
                    alt={`Edited ${index + 1}`}
                  />
                </GalleryItem>
              ))}
            </GalleryGrid>
          ) : (
            <EmptyGallery>
              <FaImage />
              <p>You haven't edited any photos yet</p>
              <Link to="/edit-photo">Start editing now</Link>
            </EmptyGallery>
          )}
        </GallerySection>
      </AccountContent>
    </AccountContainer>
  );
}

const DetailsSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
  min-width: 380px;

  @media (max-width: 900px) {
    min-width: 100%;
  }
`;

const AccountContent = styled.div`
  display: grid;
  grid-template-columns: minmax(380px, 1fr) 2fr;
  gap: 30px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const AccountContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 160px);
`;

const AccountHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h1 {
    color: #ff69b4;
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const GallerySection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  gap: 20px; /* Added gap for consistent spacing */

  h2 {
    color: #ff69b4;
    font-size: 1.8rem;
    margin-right: auto; /* Ensures the title takes available space */
  }
`;

const EditButton = styled.button`
  background: #ff69b4;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  width: 36px;
  height: 36px;

  &:hover {
    background: #ff1493;
  }
`;

const DetailItem = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: center; /* Asigură aliniere verticală corectă */

  > svg {
    /* Stil pentru icon-urile principale (FaUser, FaEnvelope etc.) */
    color: #ff69b4;
    font-size: 1.2rem;
    min-width: 24px; /* Asigură lățime fixă */
    margin-right: 15px;

    @media (max-width: 480px) {
      font-size: 1.4rem; /* Mărește puțin pe mobil */
      margin-right: 12px;
    }
  }

  div {
    flex: 1;

    h3 {
      color: #333;
      margin-bottom: 5px;
      font-size: 1.1rem;
    }

    p {
      color: #666;
      font-size: 0.95rem;
    }

    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 0.95rem;

      &:focus {
        border-color: #ff69b4;
        outline: none;
        box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
      }
    }
  }
`;

const PasswordInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const PasswordInputField = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.95rem;
  min-width: 220px; /* Increased from 200px to 220px */
  width: 100%; /* Ensure it uses available space */

  &:focus {
    border-color: #ff69b4;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  }
`;

const PasswordToggleButton = styled.button`
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 8px;
  margin-left: 4px;

  &:hover {
    color: #ff69b4;
  }

  svg {
    font-size: 1rem; /* Default size */

    @media (max-width: 480px) {
      font-size: 1.2rem; /* Larger on mobile */
    }
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
  color: ${(props) => (props.$match ? "#28a745" : "#dc3545")};
`;

const VerificationMessage = styled.p`
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;

  button {
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;

    &:first-child {
      background: #ff69b4;
      color: white;
      border: none;

      &:hover {
        background: #ff1493;
      }
    }

    &:last-child {
      background: transparent;
      color: #ff69b4;
      border: 1px solid #ff69b4;

      &:hover {
        background: rgba(255, 105, 180, 0.1);
      }
    }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  border-left: 3px solid #dc3545;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  background-color: #d4edda;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  border-left: 3px solid #28a745;
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

const GalleryHeader = styled.h2`
  color: #ff69b4;
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const GalleryItem = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  aspect-ratio: 1/1;

  &:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EmptyGallery = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;

  svg {
    font-size: 3rem;
    color: #ffcccb;
    margin-bottom: 15px;
  }

  p {
    margin-bottom: 20px;
  }

  a {
    color: #ff69b4;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default MyAccount;
