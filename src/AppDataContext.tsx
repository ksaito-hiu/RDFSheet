/*
 * アプリ全体を囲むAppDataProviderを提供する。ここで様々な初期化を行い
 * 内部のアプリの情報の大事な部分を保存し、他のコンポーネントにその情報
 * へのアクセスを提供する。
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const RDFSheetLocalStorageKey = 'RDFSheetLocalStorageKey';
const localStorage = (window as any).localStorage;

export type AppData = {
  //book: any;
  prefixes: any;
  idp: string;
};

type AppDataContextType = {
  appData: AppData;
  updateAppData: (newAppData: Partial<AppData>) => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [appData, setAppData ] = useState<AppData>({prefixes:{},idp:'none'});

  useEffect(()=>{
    const saved = localStorage.getItem(RDFSheetLocalStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setAppData((prev) => ({ ...prev, ...parsed }));
        }
      } catch(e) {
        console.warn("設定の読み込みに失敗しました。",e);
        setAppData({prefixes:{dc:'http://purl.org/dc/terms/'},idp:'https://solidcommunity.net'});
        console.warn("設定を初期化しました。");
      }
    }
  },[])

  useEffect(() => {
    localStorage.setItem(RDFSheetLocalStorageKey, JSON.stringify(appData));
  }, [appData]);

  const updateAppData = (newAppData: Partial<AppData>) => {
    setAppData((prev) => ({ ...prev, ...newAppData }));
  };

  return (
    <AppDataContext.Provider value={{ appData, updateAppData }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within a AppDataProvider');
  }
  return context;
};
