import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { updateLoginStatus } from './util.ts';
import './index.css';
import App from './App.tsx';

async function main() {
  await updateLoginStatus();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
main();
