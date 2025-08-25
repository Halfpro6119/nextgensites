import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import ConsultationPage from './pages/ConsultationPage';
import OnboardingPage from './pages/OnboardingPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectPage from './pages/ProjectPage';
import NewsletterPage from './pages/NewsletterPage';
import StrategyCallConfirmationPage from './pages/StrategyCallConfirmationPage';
import SkipCallPage from './pages/SkipCallPage';
import AIAssistantPage from './pages/AIAssistantPage';
import ReviewPage from './pages/ReviewPage';
import DemoPage from './pages/DemoPage';
import SuccessPage from './pages/SuccessPage';
import DashboardPage from './pages/DashboardPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import DebugSlugsPage from './pages/DebugSlugsPage';
import EventTicketsPage from './pages/EventTicketsPage';
import NextStepsPage from './pages/NextStepsPage';
import InboxPage from './pages/InboxPage';

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/strategy-confirmation" element={<StrategyCallConfirmationPage />} />
        <Route path="/skip-call" element={<SkipCallPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:projectId" element={<ProjectPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/review/:slug" element={<ReviewPage />} />
        <Route path="/demo/:slug" element={<DemoPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
        <Route path="/debug-slugs" element={<DebugSlugsPage />} />
        <Route path="/:slug/tickets" element={<EventTicketsPage />} />
        <Route path="/next-steps/:slug" element={<NextStepsPage />} />
        <Route path="/inbox" element={<InboxPage />} />
      </Routes>
    </>
  );
}

export default App