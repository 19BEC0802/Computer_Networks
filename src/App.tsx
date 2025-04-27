import React from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import Login from './components/Login';
import ChatContainer from './components/ChatContainer';

const ChatApp: React.FC = () => {
  const { state } = useChat();
  const { currentUser } = state;
  
  return (
    <div className="h-screen bg-gradient-to-r from-blue-500 to-teal-400 p-0 md:p-4 lg:p-8">
      <div className="bg-white h-full md:rounded-xl overflow-hidden shadow-xl flex flex-col">
        {!currentUser ? <Login /> : <ChatContainer />}
      </div>
    </div>
  );
};

function App() {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
}

export default App;