import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { updateLoginStatus } from './util.ts';
import './index.css';
import App from './App.tsx';

async function main() {
  await updateLoginStatus();

const w = (window as any);
if (w.launchQueue && w.launchQueue.setConsumer) {
  w.launchQueue.setConsumer(async (launchParams: any) => {
    if (!launchParams.files.length) return;
    for (const fileHandle of launchParams.files) {
      const file = await fileHandle.getFile();
console.log(`GAHA3: ${file.name}`);
      const content = await file.text();
      localStorage.setItem('RDFSheetTempFile',content);
    }
  });
}

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
main();
