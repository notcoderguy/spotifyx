// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CurrentPlaying from './pages/CurrentPlaying';
import TopTracks from './pages/TopTracks';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className='font-poppins'>
      <div className="max-w-4xl mx-auto mt-10 text-center">
        <Navbar />
        <Routes>
          <Route path="/" element={<CurrentPlaying />} />
          <Route path="/top-tracks" element={<TopTracks />} />
        </Routes>
      </div>
        <Footer />
    </div>
  );
}

export default App;
