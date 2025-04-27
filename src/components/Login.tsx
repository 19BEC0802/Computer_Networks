import React from 'react';
import { useChat } from '../context/ChatContext';

const Login: React.FC = () => {
  const { login } = useChat();
  
  const handleUserSelect = (userNumber: number) => {
    const userId = `user_${userNumber}`;
    login(userId);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md transform transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Select User</h1>
        
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => handleUserSelect(1)}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <img 
              src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="User 1"
              className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-blue-500"
            />
            <span className="text-lg font-medium text-gray-800">User 1</span>
          </button>
          
          <button
            onClick={() => handleUserSelect(2)}
            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
          >
            <img 
              src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="User 2"
              className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-blue-500"
            />
            <span className="text-lg font-medium text-gray-800">User 2</span>
          </button>
        </div>
        
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Click on a user to start chatting</p>
        </div>
      </div>
    </div>
  );
};

export default Login;