import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignUp 
        routing="path" 
        path="/sign-up" 
        afterSignUpUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  );
}

export default SignUpPage;