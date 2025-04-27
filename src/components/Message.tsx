import React from 'react';
import { Message as MessageType } from '../types';
import { format } from '../utils/dateFormat';

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
  const { text, timestamp, read, fileUrl, fileName, fileType } = message;
  
  return (
    <div 
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      data-testid={`message-${message.id}`}
    >
      <div 
        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
          isOwnMessage 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        } shadow-sm`}
      >
        {/* File preview for images */}
        {fileUrl && fileType === 'image' && (
          <div className="mb-2">
            <img 
              src={fileUrl} 
              alt={fileName || 'Image'} 
              className="rounded-md max-h-60 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(fileUrl, '_blank')}
            />
            {fileName && <p className="text-xs mt-1 opacity-75">{fileName}</p>}
          </div>
        )}
        
        {/* Document link */}
        {fileUrl && fileType === 'document' && (
          <div className={`mb-2 p-2 rounded-md flex items-center ${
            isOwnMessage ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`mr-2 ${isOwnMessage ? 'text-blue-100' : 'text-blue-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-sm ${isOwnMessage ? 'text-white' : 'text-blue-600'} underline`}
            >
              {fileName || 'Document'}
            </a>
          </div>
        )}
        
        {/* Message text */}
        {text && <p className="break-words">{text}</p>}
        
        {/* Timestamp and read receipt */}
        <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>{format(timestamp)}</span>
          {isOwnMessage && (
            <span>
              {read ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L7 17L2 12"></path>
                  <path d="M22 10L13.5 18.5"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17L4 12"></path>
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;