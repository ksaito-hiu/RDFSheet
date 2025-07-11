import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { updateLoginStatus } from './util.ts';
import './index.css';
import App from './App.tsx';

async function main() {
  await updateLoginStatus();

  // 以下File Handling API対応。読み込んだrdfsファイルは
  // とりあえずlocalStrageに保存。LuckySheetでは1つしかファイル
  // 開けないので、2つ目以降のファイルは無視で。
  const w = (window as any);
  let got1st: Promise<void> | null = null;
  if (w.launchQueue && w.launchQueue.setConsumer) {
    w.launchQueue.setConsumer(async (launchParams: any) => {
      if (got1st) return;
      if (!launchParams.files.length) return;
      got1st = new Promise( async (resolve) => {
        const fileHandle = launchParams.files[0];
        const file = await fileHandle.getFile();
        const content = await file.text();
        localStorage.setItem('RDFSheetTempFile',content);
        resolve();
      });
    });
  }
  if (got1st) await got1st; // 確実に待つ

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
main();
