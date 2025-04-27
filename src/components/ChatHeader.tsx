import React from 'react';
import { useChat } from '../context/ChatContext';
import { User } from '../types';

interface ChatHeaderProps {
  otherUser: User;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ otherUser }) => {
  const { logout } = useChat();
  
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <div className="relative">
          <img 
            src={otherUser.avatar} 
            alt={otherUser.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></span>
        </div>
        
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{otherUser.username}</h3>
          <p className="text-xs text-gray-500">
            {otherUser.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center">
        <button 
          onClick={logout}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;