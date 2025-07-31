import { useEffect, useRef } from 'react';
import { loadSheetsFromLocal, loadSheetsFromPod } from './util';
import type { Settings } from './util';

type Props = {
  settings: Settings;
  onLoaded: () => void;
};

const LoadComponent: React.FC<Props> = ({ settings, onLoaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fileURL: string = settings.fileSettings.podUrl;
    if (fileURL && inputRef.current) {
      inputRef.current.value = fileURL;
    }
  },[settings]);

  const processLoadFromLocal = async () => {
    await loadSheetsFromLocal();
    onLoaded();
  };

  const processLoadFromPod = async () => {
    if (!(inputRef.current)) return;
    const url = inputRef.current.value;
    await loadSheetsFromPod(url);
    onLoaded();
  };

  return (
    <>
      <h4>LoadComponent</h4>
      <div><button type="button" onClick={processLoadFromLocal}>load from local</button></div>
      <div style={{display:'flex',margin:'1em 0'}}>
        <button type="button" onClick={processLoadFromPod}>load from pod</button>
        <input type="text" ref={inputRef} style={{flexGrow:1}}/>
      </div>
    </>
  );
}

export default LoadComponent;
