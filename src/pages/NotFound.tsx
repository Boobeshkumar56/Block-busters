
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-health-50 to-health-100 px-4">
      <div className="text-center glassmorphism p-10 rounded-2xl max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-health-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-health-800" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-health-900">404</h1>
        <p className="text-xl text-health-800 mb-6">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
