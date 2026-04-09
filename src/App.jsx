import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Galleries from './pages/Galleries';
import Commercials from './pages/Commercials';
import Stories from './pages/Stories';
import About from './pages/About';
import Enquire from './pages/Enquire';

function App() {
  const getInitialPage = () => {
    const path = window.location.pathname.replace(/^\/+/, '');
    const validPages = ['splash', 'home', 'galleries', 'commercials', 'stories', 'about', 'enquire'];
    return validPages.includes(path) ? path : 'splash';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    const newPath = page === 'splash' ? '/' : `/${page}`;
    window.history.pushState(null, '', newPath);
    window.scrollTo(0, 0);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      <AnimatePresence mode="wait">
        {currentPage === 'splash' && (
          <Splash key="splash" onEnter={() => navigateTo('home')} />
        )}
        {currentPage === 'home' && (
          <Home key="home" onNavigate={navigateTo} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        )}
        {currentPage === 'galleries' && (
          <Galleries key="galleries" onBack={() => navigateTo('home')} />
        )}
        {currentPage === 'commercials' && (
          <Commercials key="commercials" onBack={() => navigateTo('home')} />
        )}
        {currentPage === 'stories' && (
          <Stories key="stories" onBack={() => navigateTo('home')} />
        )}
        {currentPage === 'about' && (
          <About key="about" onBack={() => navigateTo('home')} />
        )}
        {currentPage === 'enquire' && (
          <Enquire key="enquire" onBack={() => navigateTo('home')} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
