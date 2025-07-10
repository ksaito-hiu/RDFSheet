import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { updateLoginStatus } from './util.ts';
import './index.css';
import App from './App.tsx';

async function main() {
  await updateLoginStatus();

  const w = (window as any);
  const promises: Promise<void>[] = [];
  if (w.launchQueue && w.launchQueue.setConsumer) {
    w.launchQueue.setConsumer(async (launchParams: any) => {
      if (!launchParams.files.length) return;
      const ps = launchParams.files.map(async (fileHandle: FileSystemFileHandle)=>{
        const file = await fileHandle.getFile();
console.log(`GAHA3: ${file.name}`);
        const content = await file.text();
console.log("GAHA: setItem start");
        localStorage.setItem('RDFSheetTempFile',content);
console.log("GAHA: setItem end");
      });
      promises.push(...ps);
    });
  }
  await Promise.all(promises);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
main();
