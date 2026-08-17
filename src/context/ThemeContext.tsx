import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'sepia';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('the961_theme') as ThemeMode;
    if (saved && ['light', 'dark', 'sepia'].includes(saved)) {
      return saved;
    }
    return 'light';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('the961_theme', newTheme);
  };

  const toggleTheme = () => {
    const cycle: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'sepia',
      sepia: 'light',
    };
    setTheme(cycle[theme]);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-sepia', 'dark', 'sepia');
    
    if (theme === 'dark') {
      root.classList.add('theme-dark', 'dark');
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'sepia') {
      root.classList.add('theme-sepia', 'sepia');
      root.setAttribute('data-theme', 'sepia');
    } else {
      root.classList.add('theme-light');
      root.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
