import { useState, useEffect, useMemo } from 'react';
import { CssBaseline, ThemeProvider, createTheme, FormControlLabel, Switch } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

function storageManager({ key }) {
  return {
    get: (defaultValue) => {
      const storedValue = localStorage.getItem(key);
      return storedValue ? storedValue : defaultValue;
    },
    set: (value) => {
      localStorage.setItem(key, value);
    },
    subscribe: (handler) => {
      const listener = (event) => {
        if (event.key === key) {
          handler(event.newValue);
        }
      };
      window.addEventListener('storage', listener);
      return () => {
        window.removeEventListener('storage', listener);
      };
    },
  };
}

const ThemeManager = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const themeStorageKey = 'theme';
  const themeStorage = storageManager({ key: themeStorageKey });

  const [mode, setMode] = useState(() => {
    return themeStorage.get(prefersDarkMode ? 'dark' : 'light');
  });

  useEffect(() => {
    themeStorage.set(mode);
  }, [mode]);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <FormControlLabel
        control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
        label="Dark Mode"
      />
      {children}
    </ThemeProvider>
  );
};

export default ThemeManager;