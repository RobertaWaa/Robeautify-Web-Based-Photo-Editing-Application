import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaSignOutAlt, FaCamera, FaCheckCircle, FaTimesCircle, FaImage } from 'react-icons/fa';

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

const AccountContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    @media (min-width: 992px) {
        flex-direction: row;
    }
`;

const ProfileSection = styled.div`
    flex: 1;
    max-width: 400px;
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(255, 105, 180, 0.1);
    align-self: flex-start;
`;

const ProfilePicture = styled.div`
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto 20px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #ffcccb;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const UploadButton = styled.label`
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ff69b4;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
        background: #ff1493;
        transform: scale(1.1);
    }
    
    input {
        display: none;
    }
`;

const ProfileInfo = styled.div`
    text-align: center;
    
    h2 {
        color: #333;
        margin-bottom: 5px;
    }
    
    p {
        color: #666;
        margin-bottom: 20px;
    }
`;

const DetailsSection = styled.div`
    flex: 2;
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
    
    h2 {
        color: #ff69b4;
        font-size: 1.8rem;
    }
    
    button {
        background: #ff69b4;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s;
        
        &:hover {
            background: #ff1493;
        }
    }
`;

const DetailItem = styled.div`
    display: flex;
    margin-bottom: 20px;
    
    svg {
        color: #ff69b4;
        font-size: 1.2rem;
        margin-right: 15px;
        margin-top: 3px;
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

const GallerySection = styled.div`
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid #eee;
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

function MyAccount() {
    const { currentUser, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName || '',
        email: currentUser?.email || '',
        username: currentUser?.username || '',
        newPassword: '',
        confirmPassword: ''
    });
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editedPhotos, setEditedPhotos] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        setFormData({
            fullName: currentUser?.fullName || '',
            email: currentUser?.email || '',
            username: currentUser?.username || '',
            newPassword: '',
            confirmPassword: ''
        });
        
        if (currentUser?.profilePic) {
            setPreview(`/uploads/${currentUser.profilePic}`);
        } else {
            setPreview('/uploads/default.jpg');
        }

        // Fetch user's edited photos
        const fetchEditedPhotos = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user-photos?userId=${currentUser.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    setEditedPhotos(data.photos);
                } else {
                    setError(data.error || 'Failed to load photos');
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
                setError('Failed to load your photo gallery. Please try again later.');
            }
        };

        fetchEditedPhotos();
    }, [currentUser?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (formData.newPassword && formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('fullName', formData.fullName);
            if (profilePic) formDataToSend.append('profilePic', profilePic);
            if (formData.newPassword) formDataToSend.append('newPassword', formData.newPassword);
    
            const response = await fetch('http://localhost:5000/api/update-profile', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update profile');
            }
    
            updateUser(result.user);
            setEditMode(false);
            setSuccess('Profile updated successfully!');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const resendVerificationEmail = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/resend-verification', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                setSuccess('Verification email has been resent. Please check your inbox.');
            } else {
                setError(result.error || 'Failed to resend verification email');
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            setError('An error occurred while resending the verification email');
        }
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
                <ProfileSection>
                    <ProfilePicture>
                        <img src={preview || '/uploads/default.jpg'} alt="Profile" />
                        {editMode && (
                            <UploadButton>
                                <FaCamera />
                                <input 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    accept="image/*" 
                                />
                            </UploadButton>
                        )}
                    </ProfilePicture>
                    
                    <ProfileInfo>
                        <h2>{formData.fullName || formData.username}</h2>
                        <p>@{formData.username}</p>
                        {!currentUser.emailVerified && (
                            <p style={{ color: '#dc3545' }}>
                                <FaTimesCircle /> Email not verified. 
                                <button 
                                    onClick={resendVerificationEmail}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#007bff',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        padding: 0,
                                        marginLeft: '5px'
                                    }}
                                >
                                    Resend verification
                                </button>
                            </p>
                        )}
                    </ProfileInfo>
                </ProfileSection>
                
                <DetailsSection>
                    <SectionHeader>
                        <h2>Profile Details</h2>
                        {!editMode ? (
                            <button onClick={() => setEditMode(true)}>
                                <FaEdit /> Edit Profile
                            </button>
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
                                </div>
                            </DetailItem>
                            
                            <DetailItem>
                                <FaUser />
                                <div>
                                    <h3>Username</h3>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                    />
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
                                </div>
                            </DetailItem>
                                        
                            <DetailItem>
                                <FaUser />
                                <div>
                                    <h3>New Password</h3>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Leave blank to keep current"
                                    />
                                    {errors.newPassword && <p style={{ color: 'red' }}>{errors.newPassword}</p>}
                                </div>
                            </DetailItem>
                            
                            <DetailItem>
                                <FaUser />
                                <div>
                                    <h3>Confirm Password</h3>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your new password"
                                    />
                                    {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                                </div>
                            </DetailItem>
                            
                            <ActionButtons>
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : <><FaEdit /> Save Changes</>}
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
                                    <p>{formData.fullName || 'Not set yet'}</p>
                                </div>
                            </DetailItem>
                            
                            <DetailItem>
                                <FaEnvelope />
                                <div>
                                    <h3>Email</h3>
                                    <p>{formData.email}</p>
                                </div>
                            </DetailItem>
                            
                            <DetailItem>
                                <FaUser />
                                <div>
                                    <h3>Username</h3>
                                    <p>@{formData.username}</p>
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

                    <GallerySection>
                        <GalleryHeader>Your Photo Gallery</GalleryHeader>
                        {editedPhotos.length > 0 ? (
                            <GalleryGrid>
                                {editedPhotos.map((photo, index) => (
                                    <GalleryItem key={index}>
                                        <img src={`/uploads/${photo.filename}`} alt={`Edited ${index + 1}`} />
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
                </DetailsSection>
            </AccountContent>
        </AccountContainer>
    );
}

export default MyAccount;