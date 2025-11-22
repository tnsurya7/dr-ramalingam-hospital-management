
import React, { useState } from 'react';
import { User, Lock, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
    onLogin: () => void;
    onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Validate specific credentials
        if (username === 'ramalingam@gmail.com' && password === 'Ramalingam357') {
            onLogin();
        } else {
            alert('Invalid username or password. Please try again.');
        }
    };
    
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute bottom-6 left-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                </button>
            )}
            
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
                    <p className="mt-2 text-gray-500">Sign in to access the patient management system</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder=""
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder=""
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
