import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  // Get initial theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // When theme changes, update the data-theme attribute on <html> and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button onClick={toggleTheme} style={buttonStyle}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

// Simple inline styles (you can replace with CSS classes)
const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'var(--button-bg)',
  color: 'var(--button-text)',
  fontWeight: 'bold',
  transition: 'background-color 0.3s ease',
};

export default ThemeToggle;
