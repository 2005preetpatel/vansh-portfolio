import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Galleries from './pages/Galleries';
import Commercials from './pages/Commercials';
import Stories from './pages/Stories';
import About from './pages/About';
import Enquire from './pages/Enquire';

function App() {
  const [currentPage, setCurrentPage] = useState('splash');

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentPage === 'splash' && (
          <Splash key="splash" onEnter={() => setCurrentPage('home')} />
        )}
        {currentPage === 'home' && (
          <Home key="home" onNavigate={(page) => setCurrentPage(page)} />
        )}
        {currentPage === 'galleries' && (
          <Galleries key="galleries" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'commercials' && (
          <Commercials key="commercials" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'stories' && (
          <Stories key="stories" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'about' && (
          <About key="about" onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'enquire' && (
          <Enquire key="enquire" onBack={() => setCurrentPage('home')} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
