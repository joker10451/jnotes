'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme, eyeCareTheme } from './theme';

type ThemeMode = 'light' | 'dark' | 'eye-care';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const themes = {
  light: lightTheme,
  dark: darkTheme,
  'eye-care': eyeCareTheme,
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    // Загружаем сохранённую тему из localStorage
    const savedMode = localStorage.getItem('jnotes-theme') as ThemeMode;
    if (savedMode && themes[savedMode]) {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    // Сохраняем тему в localStorage
    localStorage.setItem('jnotes-theme', mode);
  }, [mode]);

  const toggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'eye-care'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const value = {
    mode,
    setMode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={themes[mode]}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
