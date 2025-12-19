import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Cloud } from 'lucide-react';
import {
  CenteredContainer,
  PrimaryButton,
  SecondaryButton,
} from '@/components/styled/StyledComponents';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, hsl(30, 25%, 98%) 0%, hsl(30, 20%, 95%) 100%);
`;

const HeroSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Logo = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, hsl(15, 85%, 60%) 0%, hsl(35, 90%, 55%) 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  box-shadow: 0 8px 30px hsla(15, 85%, 60%, 0.35);
  animation: ${float} 6s ease-in-out infinite;
`;

const LogoText = styled.span`
  color: white;
  font-size: 2rem;
  font-weight: 800;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: hsl(20, 25%, 10%);
  margin-bottom: 1rem;
  line-height: 1.1;

  span {
    background: linear-gradient(135deg, hsl(15, 85%, 55%) 0%, hsl(35, 90%, 50%) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${gradient} 3s ease infinite;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: hsl(20, 10%, 45%);
  max-width: 500px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 4rem auto 0;
  padding: 0 1rem;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid hsl(30, 20%, 90%);
  box-shadow: 0 2px 8px hsla(20, 25%, 10%, 0.04);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px hsla(20, 25%, 10%, 0.08);
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, hsla(15, 85%, 60%, 0.1) 0%, hsla(35, 90%, 55%, 0.1) 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: hsl(15, 85%, 55%);
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: hsl(20, 25%, 15%);
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: hsl(20, 10%, 50%);
  line-height: 1.5;
`;

const Index: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <Logo>
          <LogoText>H</LogoText>
        </Logo>
        <Title>
          Welcome to <span>HireNext</span>
        </Title>
        <Subtitle>
          A production-ready full-stack application with secure authentication, 
          image compression, and CloudFront CDN delivery.
        </Subtitle>
        <ButtonGroup>
          <Link to="/register">
            <PrimaryButton>
              Get Started
              <ArrowRight size={18} />
            </PrimaryButton>
          </Link>
          <Link to="/login">
            <SecondaryButton>
              Sign In
            </SecondaryButton>
          </Link>
        </ButtonGroup>

        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <Shield size={24} />
            </FeatureIcon>
            <FeatureTitle>JWT Authentication</FeatureTitle>
            <FeatureDescription>
              Secure token-based authentication with protected routes and automatic refresh.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Zap size={24} />
            </FeatureIcon>
            <FeatureTitle>Image Compression</FeatureTitle>
            <FeatureDescription>
              Sharp-powered compression ensures all images are under 10KB while maintaining quality.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <Cloud size={24} />
            </FeatureIcon>
            <FeatureTitle>CloudFront CDN</FeatureTitle>
            <FeatureDescription>
              Images served via AWS CloudFront for lightning-fast global delivery.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </HeroSection>
    </HomeContainer>
  );
};

export default Index;
