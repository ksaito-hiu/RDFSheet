/*
 * アプリ全体を囲むAppDataProviderを提供する。ここで様々な初期化を行い
 * 内部のアプリの情報の大事な部分を保存し、他のコンポーネントにその情報
 * へのアクセスを提供する。
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const RDFSheetLocalStorageKey = 'RDFSheetLocalStorageKey';
const localStorage = (window as any).localStorage;

export type ClientID = {
  name: string;
  provider: string;
  id: string;
  secret: string;
}

export type AppData = {
  prefixes: string; // 1行に1プレフィックス宣言
  idp: string; // ログインのためのデフォルトのidp
  clientIDs: ClientID[]; // clientSecretが必要な時の情報
};

type AppDataContextType = {
  appData: AppData;
  updateAppData: (newAppData: Partial<AppData>) => void;
};

export const defaultAppData: AppData = {
  prefixes: '@prefix dc: <http://purl.org/dc/terms/> .',
  idp: 'https://solidcommunity.net',
  clientIDs: []
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [appData, setAppData ] = useState<AppData>(() => {
    // この書き方でなくuseEffect(()=>{},[])を使うと上手くいかない
    // たぶん<StrictMode>だから・・・？
    const saved = localStorage.getItem(RDFSheetLocalStorageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...defaultAppData, ...parsed };
        }
      } catch(e) {
        console.warn("設定の読み込みに失敗しました。",e);
        console.warn("設定を初期化します。");
        return defaultAppData;
      }
    }
  });

  useEffect(() => {
    localStorage.setItem(RDFSheetLocalStorageKey, JSON.stringify(appData));
  }, [appData]);

  const updateAppData = (newAppData: Partial<AppData>) => {
    setAppData(prev => ({ ...prev, ...newAppData }));
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
