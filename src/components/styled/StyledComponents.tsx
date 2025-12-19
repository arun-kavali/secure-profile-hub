import styled, { css, keyframes } from 'styled-components';

// Animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Layout Components
export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, hsl(30, 25%, 98%) 0%, hsl(30, 20%, 95%) 100%);
`;

export const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

// Card Components
export const Card = styled.div<{ $animate?: boolean }>`
  background: linear-gradient(145deg, hsl(0, 0%, 100%) 0%, hsl(30, 20%, 98%) 100%);
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 4px 12px hsla(20, 25%, 10%, 0.08);
  border: 1px solid hsl(30, 20%, 88%);
  width: 100%;
  max-width: 420px;
  
  ${({ $animate }) =>
    $animate &&
    css`
      animation: ${slideUp} 0.5s ease-out;
    `}
`;

export const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const CardTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: hsl(20, 25%, 10%);
  margin-bottom: 0.5rem;
`;

export const CardDescription = styled.p`
  color: hsl(20, 10%, 45%);
  font-size: 0.95rem;
  line-height: 1.5;
`;

// Form Components
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(20, 25%, 15%);
`;

export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid ${({ $hasError }) => ($hasError ? 'hsl(0, 72%, 51%)' : 'hsl(30, 20%, 88%)')};
  border-radius: 0.75rem;
  background: hsl(0, 0%, 100%);
  color: hsl(20, 25%, 10%);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? 'hsl(0, 72%, 51%)' : 'hsl(15, 85%, 60%)')};
    box-shadow: 0 0 0 3px ${({ $hasError }) =>
      $hasError ? 'hsla(0, 72%, 51%, 0.1)' : 'hsla(15, 85%, 60%, 0.1)'};
  }

  &::placeholder {
    color: hsl(20, 10%, 60%);
  }

  &:disabled {
    background: hsl(30, 15%, 94%);
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.span`
  font-size: 0.8rem;
  color: hsl(0, 72%, 51%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Button Components
const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase}
  background: linear-gradient(135deg, hsl(15, 85%, 60%) 0%, hsl(35, 90%, 55%) 100%);
  color: hsl(0, 0%, 100%);
  box-shadow: 0 4px 12px hsla(15, 85%, 60%, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px hsla(15, 85%, 60%, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  ${buttonBase}
  background: hsl(0, 0%, 100%);
  color: hsl(20, 25%, 20%);
  border: 2px solid hsl(30, 20%, 88%);

  &:hover:not(:disabled) {
    background: hsl(30, 15%, 97%);
    border-color: hsl(30, 20%, 80%);
  }
`;

export const GhostButton = styled.button`
  ${buttonBase}
  background: transparent;
  color: hsl(15, 85%, 55%);
  padding: 0.5rem 1rem;

  &:hover:not(:disabled) {
    background: hsla(15, 85%, 60%, 0.08);
  }
`;

// Loading Spinner
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div<{ $size?: number }>`
  width: ${({ $size }) => $size || 20}px;
  height: ${({ $size }) => $size || 20}px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

// Alert Components
export const Alert = styled.div<{ $variant?: 'error' | 'success' | 'warning' }>`
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  animation: ${slideUp} 0.3s ease-out;

  ${({ $variant }) => {
    switch ($variant) {
      case 'error':
        return css`
          background: hsla(0, 72%, 51%, 0.08);
          border: 1px solid hsla(0, 72%, 51%, 0.2);
          color: hsl(0, 72%, 45%);
        `;
      case 'success':
        return css`
          background: hsla(145, 65%, 42%, 0.08);
          border: 1px solid hsla(145, 65%, 42%, 0.2);
          color: hsl(145, 65%, 35%);
        `;
      case 'warning':
        return css`
          background: hsla(38, 92%, 50%, 0.08);
          border: 1px solid hsla(38, 92%, 50%, 0.2);
          color: hsl(38, 92%, 40%);
        `;
      default:
        return css`
          background: hsla(30, 15%, 94%, 1);
          border: 1px solid hsl(30, 20%, 88%);
          color: hsl(20, 25%, 30%);
        `;
    }
  }}
`;

// Avatar Components
export const Avatar = styled.div<{ $size?: number }>`
  width: ${({ $size }) => $size || 100}px;
  height: ${({ $size }) => $size || 100}px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, hsl(15, 85%, 60%) 0%, hsl(35, 90%, 55%) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(0, 0%, 100%);
  font-size: ${({ $size }) => ($size || 100) / 2.5}px;
  font-weight: 700;
  box-shadow: 0 4px 12px hsla(15, 85%, 60%, 0.3);
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.span`
  text-transform: uppercase;
`;

// Upload Components
export const UploadArea = styled.label<{ $isDragging?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed ${({ $isDragging }) => ($isDragging ? 'hsl(15, 85%, 60%)' : 'hsl(30, 20%, 80%)')};
  border-radius: 1rem;
  background: ${({ $isDragging }) =>
    $isDragging ? 'hsla(15, 85%, 60%, 0.05)' : 'hsl(30, 15%, 98%)'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    border-color: hsl(15, 85%, 60%);
    background: hsla(15, 85%, 60%, 0.03);
  }
`;

export const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: hsl(15, 85%, 60%);
`;

export const UploadText = styled.p`
  color: hsl(20, 25%, 30%);
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

export const UploadHint = styled.span`
  color: hsl(20, 10%, 50%);
  font-size: 0.8rem;
`;

// Link
export const StyledLink = styled.a`
  color: hsl(15, 85%, 55%);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: hsl(15, 85%, 45%);
    text-decoration: underline;
  }
`;

// Divider
export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: hsl(20, 10%, 55%);
  font-size: 0.85rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: hsl(30, 20%, 88%);
  }
`;

// Progress Bar (for upload)
export const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  background: hsl(30, 15%, 94%);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

export const ProgressBar = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, hsl(15, 85%, 60%) 0%, hsl(35, 90%, 55%) 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
`;

// Skeleton loader
export const Skeleton = styled.div<{ $width?: string; $height?: string }>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1rem'};
  background: linear-gradient(
    90deg,
    hsl(30, 15%, 94%) 25%,
    hsl(30, 15%, 90%) 50%,
    hsl(30, 15%, 94%) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 0.5rem;
`;
