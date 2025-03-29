import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ResumeParser from './components/ResumeParser';
import UserDashboard from './components/UserDashboard'; // Ensure this path is correct

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <ResumeParser />;
}

function App() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => window.location.href = to}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <SignInPage />
              </SignedOut>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            }
          />
          <Route
            path="/parser"
            element={
              <>
                <SignedIn>
                  <AuthenticatedLayout />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />
          {/* Route for the UserDashboard */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <UserDashboard />
              </SignedIn>
            }
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;