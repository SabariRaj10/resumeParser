import { Link } from 'react-router-dom';
import { Button, Typography, Card, CardBody, CardFooter, Navbar, MobileNav } from '@material-tailwind/react';
import { useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import land1 from '../../public/landing.jpg'
import land2 from '../../public/f1.jpg'
import land3 from '../../public/f2.jpg'
import land4 from '../../public/f3.jpg'

function Landing() {
  const { isSignedIn, signOut } = useAuth();
  const [openNav, setOpenNav] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [featureImageUrl1, setFeatureImageUrl1] = useState('');
  const [featureImageUrl2, setFeatureImageUrl2] = useState('');

  useEffect(() => {
    // Fetching random images from Unsplash (replace with more specific queries if needed)
    fetch('https://source.unsplash.com/random/1920x1080/?technology')
      .then((response) => setHeroImageUrl(response.url));
    fetch('https://source.unsplash.com/random/600x400/?analysis')
      .then((response) => setFeatureImageUrl1(response.url));
    fetch('https://source.unsplash.com/random/600x400/?document,information')
      .then((response) => setFeatureImageUrl2(response.url));
  }, []);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navListItems = (
    <>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="#" className="flex items-center">
          How it Works
        </Link>
      </Typography>
      {/* <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="#" className="flex items-center">
          Pricing
        </Link>
      </Typography> */}
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="#" className="flex items-center">
          Contact
        </Link>
      </Typography>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar className="sticky top-0 z-10 bg-white shadow-md mx-auto py-2 px-4 lg:px-8">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer text-xl font-bold"
          >
            Resume Parser
          </Typography>
          <div className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {navListItems}
              {isSignedIn ? (
                <li>
                  <Button size="sm" color="red" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/sign-in">
                      <Button size="sm" color="blue">
                        Sign In
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/sign-up">
                      <Button size="sm" color="blue" variant="outlined">
                        Sign Up
                      </Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <Button
            className="lg:hidden"
            onClick={() => setOpenNav(!openNav)}
          >
            Menu
          </Button>
        </div>
        <MobileNav open={openNav}>
          <ul className="mt-2 mb-4">
            {navListItems}
            {isSignedIn ? (
              <li className="flex justify-center mt-4">
                <Button size="sm" color="red" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </li>
            ) : (
              <>
                <li className="flex justify-center mt-4">
                  <Link to="/sign-in">
                    <Button size="sm" color="blue">
                      Sign In
                    </Button>
                  </Link>
                </li>
                <li className="flex justify-center mt-2">
                  <Link to="/sign-up">
                    <Button size="sm" color="blue" variant="outlined">
                      Sign Up
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </MobileNav>
      </Navbar>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-32"
        style={{ backgroundImage: `url('${land1}')` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Typography variant="h1" color="white" className="mb-6">
            Unlock Your Career Potential with AI-Powered Resume Parsing
          </Typography>
          <Typography variant="lead" color="white" className="mb-8">
            Effortlessly extract key information from your resume and gain valuable insights.
          </Typography>
          <Link to={isSignedIn ? "/parser" : "/sign-up"}>
            <Button size="lg" color="blue">
              {isSignedIn ? "Go to Parser" : "Get Started for Free"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <Typography variant="h2" className="text-center mb-8">
          Key Features
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card shadow={true}>
            <div className="relative h-48 overflow-hidden rounded-md">
              {featureImageUrl1 && (
                <img
                  src={land2}
                  alt="Feature 1"
                  className="object-contain w-full h-full"
                />
              )}
            </div>
            <CardBody>
              <Typography variant="h5" className="mb-2">
                Effortless Data Extraction
              </Typography>
              <Typography>
                Our AI algorithms accurately extract crucial details like contact information, work experience, education, and skills.
              </Typography>
            </CardBody>
          </Card>

          <Card shadow={true}>
            <div className="relative h-48 overflow-hidden rounded-md">
              {featureImageUrl2 && (
                <img
                  src={land3}
                  alt="Feature 2"
                  className="object-contain w-full h-full"
                />
              )}
            </div>
            <CardBody>
              <Typography variant="h5" className="mb-2">
                Organized User Panel
              </Typography>
              <Typography>
                Access and manage your parsed resume data in a clean and intuitive user-friendly dashboard.
              </Typography>
            </CardBody>
          </Card>

          <Card shadow={true}>
            <div className="relative h-48 overflow-hidden rounded-md">
            <img
                  src={land4}
                  alt="Feature 2"
                  className="object-contain w-full h-full"
                />
            </div>
            <CardBody>
              <Typography variant="h5" className="mb-2">
                Continuous Improvement
              </Typography>
              <Typography>
                We are constantly working on adding new features and improving the accuracy of our resume parser.
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <Typography variant="h3" className="mb-8">
            Ready to Simplify Your Resume Analysis?
          </Typography>
          <Link to={isSignedIn ? "/parser" : "/sign-up"}>
            <Button size="lg" color="blue">
              {isSignedIn ? "Go to Your Dashboard" : "Sign Up and Start Parsing"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-200 py-8 text-center text-gray-600">
        <Typography variant="small">
          &copy; {new Date().getFullYear()} Resume Parser. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
}

export default Landing;