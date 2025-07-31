import { useEffect, useRef } from 'react';
import { saveSheetsToLocal, saveSheetsToPod } from './util';
import type { Settings } from './util';

type Props = {
  settings: Settings;
  onSaved: () => void;
};

const SaveComponent: React.FC<Props> = ({ settings, onSaved }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fileURL: string = settings.fileSettings.podUrl;
    if (fileURL && inputRef.current) {
      inputRef.current.value = fileURL;
    }
  },[settings]);

  const processSaveToLocal = () => {
    saveSheetsToLocal();
    onSaved();
  };

  const processSaveToPod = () => {
    if (!(inputRef.current)) return;
    const url = inputRef.current.value;
    saveSheetsToPod(url);
    onSaved();
  };

  return (
    <>
      <h4>SaveComponent</h4>
      <div><button type="button" onClick={processSaveToLocal}>save to local</button></div>
      <div style={{display:'flex',margin:'1em 0'}}>
        <button type="button" onClick={processSaveToPod}>save to pod</button>
        <input type="text" ref={inputRef} style={{flexGrow:1}}/>
      </div>
    </>
  );
}

export default SaveComponent;
