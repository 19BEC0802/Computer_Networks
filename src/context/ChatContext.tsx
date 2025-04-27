import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChatState, Message, User } from '../types';

const initialState: ChatState = {
  messages: [],
  users: {
    user_1: {
      id: 'user_1',
      username: 'User 1',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: false,
      lastSeen: new Date().toISOString()
    },
    user_2: {
      id: 'user_2',
      username: 'User 2',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      isOnline: false,
      lastSeen: new Date().toISOString()
    }
  },
  currentUser: null,
  isTyping: false
};

const loadState = (): ChatState => {
  try {
    const savedMessages = localStorage.getItem('chat_messages');
    const savedUsers = localStorage.getItem('chat_users');
    
    return {
      messages: savedMessages ? JSON.parse(savedMessages) : initialState.messages,
      users: savedUsers ? JSON.parse(savedUsers) : initialState.users,
      currentUser: null,
      isTyping: false
    };
  } catch (err) {
    return initialState;
  }
};

type ChatAction = 
  | { type: 'LOGIN', payload: { id: string } }
  | { type: 'LOGOUT' }
  | { type: 'SEND_MESSAGE', payload: Omit<Message, 'id' | 'timestamp' | 'read'> }
  | { type: 'SET_TYPING', payload: boolean }
  | { type: 'READ_MESSAGES' }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_MESSAGES' };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'LOGIN':
      const { id } = action.payload;
      const user = state.users[id];
      
      if (!user) return state;
      
      const updatedUsers = {
        ...state.users,
        [id]: {
          ...user,
          isOnline: true,
          lastSeen: new Date().toISOString()
        }
      };
      
      localStorage.setItem('chat_users', JSON.stringify(updatedUsers));
      
      return {
        ...state,
        users: updatedUsers,
        currentUser: updatedUsers[id]
      };
      
    case 'LOGOUT':
      if (!state.currentUser) return state;
      
      const usersAfterLogout = {
        ...state.users,
        [state.currentUser.id]: {
          ...state.users[state.currentUser.id],
          isOnline: false,
          lastSeen: new Date().toISOString()
        }
      };
      
      localStorage.setItem('chat_users', JSON.stringify(usersAfterLogout));
      
      return {
        ...state,
        users: usersAfterLogout,
        currentUser: null
      };
      
    case 'SEND_MESSAGE':
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        ...action.payload
      };
      
      const updatedMessages = [...state.messages, newMessage];
      localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
      
      return {
        ...state,
        messages: updatedMessages
      };
      
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
      
    case 'READ_MESSAGES':
      if (!state.currentUser) return state;
      
      const otherUserId = Object.keys(state.users).find(id => id !== state.currentUser?.id);
      if (!otherUserId) return state;
      
      const messagesWithRead = state.messages.map(msg => 
        msg.senderId === otherUserId ? { ...msg, read: true } : msg
      );
      
      localStorage.setItem('chat_messages', JSON.stringify(messagesWithRead));
      
      return {
        ...state,
        messages: messagesWithRead
      };
      
    case 'UPDATE_MESSAGES':
      const storedMessages = localStorage.getItem('chat_messages');
      const storedUsers = localStorage.getItem('chat_users');
      
      return {
        ...state,
        messages: storedMessages ? JSON.parse(storedMessages) : state.messages,
        users: storedUsers ? JSON.parse(storedUsers) : state.users
      };
      
    case 'CLEAR_MESSAGES':
      localStorage.removeItem('chat_messages');
      return {
        ...state,
        messages: []
      };
      
    default:
      return state;
  }
};

type ChatContextType = {
  state: ChatState;
  login: (userId: string) => void;
  logout: () => void;
  sendMessage: (text: string, fileUrl?: string, fileName?: string, fileType?: 'image' | 'document') => void;
  setTyping: (isTyping: boolean) => void;
  readMessages: () => void;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, loadState());
  
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_MESSAGES' });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const login = (userId: string) => {
    dispatch({ type: 'LOGIN', payload: { id: userId } });
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  const sendMessage = (text: string, fileUrl?: string, fileName?: string, fileType?: 'image' | 'document') => {
    if (!state.currentUser) return;
    
    dispatch({ 
      type: 'SEND_MESSAGE', 
      payload: { 
        senderId: state.currentUser.id, 
        text, 
        fileUrl, 
        fileName, 
        fileType 
      } 
    });
  };
  
  const setTyping = (isTyping: boolean) => {
    dispatch({ type: 'SET_TYPING', payload: isTyping });
  };
  
  const readMessages = () => {
    dispatch({ type: 'READ_MESSAGES' });
  };
  
  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };
  
  return (
    <ChatContext.Provider value={{ 
      state, 
      login, 
      logout, 
      sendMessage, 
      setTyping, 
      readMessages, 
      clearMessages 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};