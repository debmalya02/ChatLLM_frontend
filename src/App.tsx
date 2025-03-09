import React, { useEffect, useState } from 'react';
import { ConversationList } from './components/ConversationList';
import { ChatContainer } from './components/ChatContainer';
import useStore from './store/useStore';
import { Menu, X } from 'lucide-react';
import { Button } from './components/ui/button';

function App() {
  const { userPreferences } = useStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', userPreferences.theme === 'dark');
  }, [userPreferences.theme]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 transform md:relative md:translate-x-0 md:w-80 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <ConversationList onConversationSelect={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:pl-0">
        <ChatContainer />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;