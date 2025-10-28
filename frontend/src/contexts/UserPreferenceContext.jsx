import React, { createContext, useContext, useState, useEffect } from 'react';

const UserPreferenceContext = createContext();

export const UserPreferenceProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : { language: 'en', itemsPerPage: 10 };
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPrefs) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  return (
    <UserPreferenceContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserPreferenceContext.Provider>
  );
};

export const useUserPreference = () => {
  const context = useContext(UserPreferenceContext);
  if (!context) throw new Error('useUserPreference must be used within UserPreferenceProvider');
  return context;
};
