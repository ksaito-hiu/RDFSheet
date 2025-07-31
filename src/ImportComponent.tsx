import { useEffect, useRef } from 'react';
import { importRDFFromLocal, importRDFFromPod } from './util';
import type { Setting, Settings } from './util';

type Props = {
  settings: Settings;
  onImported: () => void;
};

const ImportComponent: React.FC<Props> = ({ settings, onImported }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rdfURL: string | null = settings.sheets.reduce(
      (acc: string | null, cur: Setting) => acc!==null?acc:((cur.status===1)?cur.rdfPodUrl:acc),
      null
    );
    if (rdfURL && inputRef.current) {
      inputRef.current.value = rdfURL;
    }
  },[settings]);

  const processImportFromLocal = () => {
    importRDFFromLocal();
    onImported();
  };

  const processImportFromPod = () => {
    if (!(inputRef.current)) return;
    const url = inputRef.current.value;
    importRDFFromPod(url);
    onImported();
  };

  return (
    <>
      <h4>ImportComponent</h4>
      <div><button type="button" onClick={processImportFromLocal}>import from local</button></div>
      <div style={{display:'flex',margin:'1em 0'}}>
        <button type="button" onClick={processImportFromPod}>import from pod</button>
        <input type="text" ref={inputRef} style={{flexGrow:1}}/>
      </div>
    </>
  );
}

export default ImportComponent;
