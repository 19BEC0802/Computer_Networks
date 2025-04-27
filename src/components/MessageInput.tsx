import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { sendMessage, setTyping } = useChat();
  
  // Set up emoji picker
  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🙏', '😍', '😅', '🤔'];
  
  // Handle file selection
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Free memory when component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  
  // Handle typing state
  useEffect(() => {
    if (message) {
      setTyping(true);
    } else {
      setTyping(false);
    }
    
    return () => setTyping(false);
  }, [message, setTyping]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && !file) || !sendMessage) return;
    
    if (file) {
      // In a real app, you would upload the file to a server here
      // For this example, we'll just use the object URL as if it were uploaded
      const fileUrl = previewUrl;
      const fileName = file.name;
      const fileType = file.type.startsWith('image/') ? 'image' : 'document';
      
      sendMessage(message.trim(), fileUrl || undefined, fileName, fileType);
    } else {
      sendMessage(message.trim());
    }
    
    setMessage('');
    setFile(null);
    setPreviewUrl(null);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      return;
    }
    
    setFile(e.target.files[0]);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleEmojiClick = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setIsEmojiPickerOpen(false);
  };
  
  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="px-4 py-3 bg-white border-t border-gray-200">
      {/* File Preview */}
      {file && previewUrl && (
        <div className="mb-2 relative rounded-lg overflow-hidden border border-gray-200">
          {file.type.startsWith('image/') ? (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-40 w-auto object-contain mx-auto"
            />
          ) : (
            <div className="p-3 bg-gray-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span className="text-sm truncate max-w-xs">{file.name}</span>
            </div>
          )}
          <button 
            onClick={removeFile}
            className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white shadow-sm hover:bg-red-600 transition-colors"
            aria-label="Remove file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full py-2 px-4 pr-10 rounded-l-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            type="button"
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-700"
            aria-label="Add emoji"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
          
          {/* Emoji Picker */}
          {isEmojiPickerOpen && (
            <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
              <div className="grid grid-cols-6 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 text-xl hover:bg-gray-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        <button
          type="button"
          onClick={triggerFileInput}
          className="p-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Attach file"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
        </button>
        
        <button
          type="submit"
          className="p-3 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 transition-colors"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;