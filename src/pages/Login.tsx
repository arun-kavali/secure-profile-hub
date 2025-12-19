import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      navigate('/profile');
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setApiError(
        axiosError.response?.data?.message || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContainer>
      <Card $animate>
        <CardHeader>
          <Logo>
            <LogoText>H</LogoText>
          </Logo>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>

        {apiError && (
          <Alert $variant="error" style={{ marginBottom: '1.5rem' }}>
            {apiError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
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

          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </PrimaryButton>
        </Form>

        <FooterText>
          Don't have an account?{' '}
          <StyledLink as={Link} to="/register">
            Create one
          </StyledLink>
        </FooterText>
      </Card>
    </CenteredContainer>
  );
};

export default Login;
