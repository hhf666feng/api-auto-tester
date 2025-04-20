import React, { createContext, useContext, useState } from 'react';
import { ApiDetail } from '../types';

interface ApiContextType {
  selectedApi: ApiDetail | null;
  setSelectedApi: (api: ApiDetail) => void;
  testCase: string;
  setTestCase: (code: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedApi, setSelectedApi] = useState<ApiDetail | null>(null);
  const [testCase, setTestCase] = useState<string>('');

  return (
    <ApiContext.Provider value={{
      selectedApi,
      setSelectedApi,
      testCase,
      setTestCase,
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}; 