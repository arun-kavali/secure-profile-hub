import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import {
  CenteredContainer,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Form,
  FormGroup,
  Label,
  Input,
  PrimaryButton,
  Alert,
  StyledLink,
  ErrorText,
} from '@/components/styled/StyledComponents';
import styled from 'styled-components';

const Logo = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, hsl(15, 85%, 60%) 0%, hsl(35, 90%, 55%) 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 12px hsla(15, 85%, 60%, 0.3);
`;

const LogoText = styled.span`
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: hsl(20, 10%, 55%);
  display: flex;
`;

const StyledInput = styled(Input)`
  padding-left: 2.75rem;
`;

const FooterText = styled.p`
  text-align: center;
  color: hsl(20, 10%, 45%);
  font-size: 0.9rem;
  margin-top: 1.5rem;
`;

const SuccessAlert = styled(Alert)`
  background: hsl(142, 70%, 95%);
  border-color: hsl(142, 70%, 45%);
  color: hsl(142, 70%, 25%);
`;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const { error } = await register(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.name.trim()
      );

      if (error) {
        if (error.message.includes('already registered')) {
          setApiError('This email is already registered. Please login instead.');
        } else {
          setApiError(error.message);
        }
      } else {
        setSuccessMessage('Account created! Please check your email to confirm your account.');
      }
    } catch (error) {
      setApiError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <CenteredContainer>
        <Loader2 className="animate-spin" size={32} />
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <Card $animate>
        <CardHeader>
          <Logo>
            <LogoText>H</LogoText>
          </Logo>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Join us today and start your journey
          </CardDescription>
        </CardHeader>

        {apiError && (
          <Alert $variant="error" style={{ marginBottom: '1.5rem' }}>
            {apiError}
          </Alert>
        )}

        {successMessage && (
          <SuccessAlert style={{ marginBottom: '1.5rem' }}>
            {successMessage}
          </SuccessAlert>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <InputWrapper>
              <InputIcon>
                <User size={18} />
              </InputIcon>
              <StyledInput
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                $hasError={!!errors.name}
                disabled={isLoading}
              />
            </InputWrapper>
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={18} />
              </InputIcon>
              <StyledInput
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                $hasError={!!errors.email}
                disabled={isLoading}
              />
            </InputWrapper>
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <StyledInput
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                $hasError={!!errors.password}
                disabled={isLoading}
              />
            </InputWrapper>
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={18} />
              </InputIcon>
              <StyledInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                $hasError={!!errors.confirmPassword}
                disabled={isLoading}
              />
            </InputWrapper>
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </FormGroup>

          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </PrimaryButton>
        </Form>

        <FooterText>
          Already have an account?{' '}
          <StyledLink as={Link} to="/login">
            Sign in
          </StyledLink>
        </FooterText>
      </Card>
    </CenteredContainer>
  );
};

export default Register;
