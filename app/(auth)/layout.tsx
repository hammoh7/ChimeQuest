"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setBackgroundPosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden"
      style={{
        backgroundPosition: `${backgroundPosition.x * 100}% ${backgroundPosition.y * 100}%`,
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-2xl flex max-w-4xl w-full mx-4 overflow-hidden"
      >
        <div className="w-1/2 p-12 flex flex-col items-start justify-center text-white">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-bold mb-6"
          >
            ChimeQuest
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl mb-6"
          >
            Welcome to the place for creating communities, have communication with your loved ones!
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg"
          >
            Building Connections, Sparking Conversations: Your Hub for Community Engagement
          </motion.p>
        </div>
        <div className="w-1/2 p-12 flex items-center justify-center bg-white bg-opacity-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;