import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/lib/api';
import { getMediaUrl } from '@/config/env';
import { AxiosError } from 'axios';
import { Upload, LogOut, Camera, Check, AlertCircle, User } from 'lucide-react';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  Alert,
  Avatar,
  AvatarImage,
  AvatarPlaceholder,
  UploadArea,
  UploadText,
  UploadHint,
  ProgressContainer,
  ProgressBar,
  Skeleton,
} from '@/components/styled/StyledComponents';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: hsl(20, 25%, 10%);
`;

const ProfileCard = styled(Card)`
  max-width: none;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const UploadBadge = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, hsl(15, 85%, 60%) 0%, hsl(35, 90%, 55%) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 8px hsla(0, 0%, 0%, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UserInfo = styled.div`
  text-align: center;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(20, 25%, 10%);
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.p`
  color: hsl(20, 10%, 45%);
  font-size: 0.95rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: hsl(30, 15%, 98%);
  border-radius: 0.75rem;
  border: 1px solid hsl(30, 20%, 92%);
`;

const InfoLabel = styled.span`
  color: hsl(20, 10%, 45%);
  font-size: 0.9rem;
`;

const InfoValue = styled.span`
  color: hsl(20, 25%, 15%);
  font-weight: 600;
  font-size: 0.9rem;
`;

const UploadCard = styled(Card)`
  max-width: none;
`;

const UploadStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const SuccessStatus = styled(UploadStatus)`
  background: hsla(145, 65%, 42%, 0.08);
  border: 1px solid hsla(145, 65%, 42%, 0.2);
  color: hsl(145, 65%, 35%);
`;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, JPEG, and PNG files are allowed';
    }
    // No size limit on client - backend will compress
    return null;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setUploadError(error);
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    setUploadProgress(0);

    // Simulate progress (real progress would come from axios)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const response = await userApi.uploadProfileImage(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Update user with new profile image key
      if (user) {
        updateUser({
          ...user,
          profile_image_key: response.profile_image_key,
        });
      }
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      clearInterval(progressInterval);
      const axiosError = error as AxiosError<{ message: string }>;
      setUploadError(
        axiosError.response?.data?.message ||
        'Failed to upload image. Please try again.'
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [user, updateUser]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const profileImageUrl = user?.profile_image_key 
    ? getMediaUrl(user.profile_image_key) 
    : null;

  if (authLoading) {
    return (
      <ProfileContainer>
        <Header>
          <Skeleton $width="150px" $height="2rem" />
        </Header>
        <ProfileCard>
          <AvatarSection>
            <Skeleton $width="120px" $height="120px" style={{ borderRadius: '50%' }} />
            <Skeleton $width="200px" $height="1.5rem" />
            <Skeleton $width="150px" $height="1rem" />
          </AvatarSection>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <PageContainer>
      <ProfileContainer>
        <Header>
          <Title>Profile</Title>
          <GhostButton onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </GhostButton>
        </Header>

        <ProfileCard $animate>
          <AvatarSection>
            <AvatarWrapper>
              <Avatar $size={120}>
                {profileImageUrl ? (
                  <AvatarImage src={profileImageUrl} alt={user.name} />
                ) : (
                  <AvatarPlaceholder>{getInitials(user.name)}</AvatarPlaceholder>
                )}
              </Avatar>
              <UploadBadge htmlFor="avatar-upload-small">
                <Camera size={16} color="white" />
                <HiddenInput
                  id="avatar-upload-small"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
              </UploadBadge>
            </AvatarWrapper>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserEmail>{user.email}</UserEmail>
            </UserInfo>
          </AvatarSection>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>Member since</InfoLabel>
              <InfoValue>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Profile Image</InfoLabel>
              <InfoValue>
                {user.profile_image_key ? 'Uploaded' : 'Not set'}
              </InfoValue>
            </InfoItem>
          </InfoGrid>
        </ProfileCard>

        <UploadCard>
          <CardHeader style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <CardTitle style={{ fontSize: '1.25rem' }}>Upload Profile Image</CardTitle>
            <CardDescription>
              Upload a JPG, JPEG, or PNG image. Images will be compressed to under 10KB.
            </CardDescription>
          </CardHeader>

          <UploadArea
            htmlFor="avatar-upload"
            $isDragging={isDragging}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div style={{ color: 'hsl(15, 85%, 60%)' }}>
              <Upload size={48} />
            </div>
            <UploadText>
              {isUploading ? 'Uploading...' : 'Drag and drop or click to upload'}
            </UploadText>
            <UploadHint>JPG, JPEG, PNG • Any size (will be compressed)</UploadHint>
            <HiddenInput
              id="avatar-upload"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </UploadArea>

          {isUploading && (
            <ProgressContainer>
              <ProgressBar $progress={uploadProgress} />
            </ProgressContainer>
          )}

          {uploadError && (
            <Alert $variant="error" style={{ marginTop: '1rem' }}>
              <AlertCircle size={18} />
              {uploadError}
            </Alert>
          )}

          {uploadSuccess && (
            <SuccessStatus>
              <Check size={18} />
              Profile image updated successfully!
            </SuccessStatus>
          )}
        </UploadCard>
      </ProfileContainer>
    </PageContainer>
  );
};

export default Profile;
