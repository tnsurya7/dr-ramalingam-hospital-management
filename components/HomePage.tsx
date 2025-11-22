import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigateToLogin: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your Health, Our Priority - Experience world-class healthcare with compassion and excellence.
        </p>
        
        {/* Doctor Details */}
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dr. A. RAMALINGAM</h2>
          <p className="text-xl text-blue-600 font-medium">M.B.B.S., M.D</p>
        </div>

        <button
          onClick={onNavigateToLogin}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto text-lg"
        >
          Admin Login
          <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;