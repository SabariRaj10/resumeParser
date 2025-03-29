import { Link } from 'react-router-dom';
import { Button, Typography } from '@material-tailwind/react';
import { useAuth } from '@clerk/clerk-react';

function Landing() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Typography variant="h1" className="mb-6">
            Resume Parser
          </Typography>
          <Typography variant="lead" className="mb-8">
            Upload your resume and let our AI analyze it for you
          </Typography>
          <div className="flex justify-center gap-4">
            {isSignedIn ? (
              <Link to="/parser">
                <Button size="lg" color="blue">
                  Go to Parser
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button size="lg" color="blue">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="lg" color="blue" variant="outlined">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;