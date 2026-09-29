import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('divakaram_auth', 'true');
    navigate('/');
  };

  const handleDemoLogin = () => {
    localStorage.setItem('divakaram_auth', 'true');
    navigate('/');
  };

  const inputStyle = "w-full px-4 py-2 mt-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-50 p-3 rounded-full mb-4">
            <Cpu className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-gray-500 text-sm mt-2 text-center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                className={inputStyle}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              className={inputStyle}
              placeholder="admin@divakaram.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className={inputStyle}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input 
                type="password" 
                className={inputStyle}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Demo Admin Bypass */}
        <button 
          onClick={handleDemoLogin}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all flex justify-center items-center gap-2"
        >
          Login as Demo Admin
        </button>

      </div>
    </div>
  );
};

export default Login;
