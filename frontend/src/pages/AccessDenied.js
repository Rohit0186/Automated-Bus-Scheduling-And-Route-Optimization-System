import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="glass-morphism p-8 max-w-md w-full border-t-4 border-red-500 animate-fade-in-up">
        <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">403 - Access Denied</h1>
        <p className="text-text-light mb-8">
          Sorry, you do not have permission to view this page. This area is reserved for authorized personnel.
        </p>
        
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-primary w-full flex items-center justify-center gap-2 h-12"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        <button 
          onClick={() => navigate('/')}
          className="mt-4 text-primary hover:underline font-semibold"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
