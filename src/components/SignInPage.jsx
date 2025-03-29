import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function SignInPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn 
        routing="path" 
        path="/sign-in" 
        afterSignInUrl="/"
        signUpUrl="/sign-up"
      />
    </div>
  );
}

export default SignInPage;