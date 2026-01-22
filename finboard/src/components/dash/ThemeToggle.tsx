'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme:', savedTheme);
    
    if (savedTheme === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
      console.log('Applied dark mode from storage');
    } else if (savedTheme === 'light') {
      setDark(false);
      document.documentElement.classList.remove('dark');
      console.log('Applied light mode from storage');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
      document.documentElement.classList.add('dark');
      console.log('Applied dark mode from system preference');
    }
  }, []);

  const toggle = () => {
    setDark(prevDark => {
      const newDark = !prevDark;
      console.log('Toggle clicked, switching from', prevDark, 'to', newDark);
      
      if (newDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        console.log('Switched to dark mode');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        console.log('Switched to light mode');
      }
      return newDark;
    });
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="p-2 rounded-full w-10 h-10" />;
  }

  return (
    <button 
      onClick={toggle} 
      className="p-2 rounded-full transition-colors"
      style={{
        backgroundColor: dark ? '#1f2937' : '#e5e7eb',
        cursor: 'pointer'
      }}
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun size={20} style={{ color: '#fbbf24' }} />
      ) : (
        <Moon size={20} style={{ color: '#4b5563' }} />
      )}
    </button>
  );
}