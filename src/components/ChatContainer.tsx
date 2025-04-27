import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import ChatHeader from './ChatHeader';
import Message from './Message';
import MessageInput from './MessageInput';

const ChatContainer: React.FC = () => {
  const { state, readMessages } = useChat();
  const { messages, currentUser, users, isTyping } = state;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get the other user (not the current one)
  const otherUserId = Object.keys(users).find(id => id !== currentUser?.id);
  const otherUser = otherUserId ? users[otherUserId] : null;
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Mark messages as read when the chat is viewed
  useEffect(() => {
    readMessages();
    // Setup interval to periodically mark messages as read (simulating real-time updates)
    const interval = setInterval(readMessages, 5000);
    return () => clearInterval(interval);
  }, [readMessages]);
  
  if (!currentUser || !otherUser) {
    return null;
  }
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader otherUser={otherUser} />
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <p className="mt-2">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === currentUser.id}
              />
            ))}
          </>
        )}
        
        {/* Typing indicator */}
        {isTyping && otherUser.isOnline && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <div className="flex space-x-1 mr-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </div>
            <span>{otherUser.username} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput />
    </div>
  );
};

export default ChatContainer;