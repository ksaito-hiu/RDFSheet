import { useEffect, useRef } from 'react';
import { exportRDFToLocal, exportRDFToPod } from './util';
import type { Setting } from './util';

type Props = {
  settings: Setting[];
  onExported: () => void;
};

const ExportComponent: React.FC<Props> = ({ settings, onExported }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rdfURL: string | null = settings.reduce(
      (acc: string | null, cur: Setting) => acc!==null?acc:((cur.status===1)?cur.rdfURL:acc),
      null
    );
    if (rdfURL && inputRef.current) {
      inputRef.current.value = rdfURL;
    }
  },[settings]);

  const processExportToLocal = () => {
    exportRDFToLocal();
    onExported();
  };

  const processExportToPod = () => {
    if (!(inputRef.current)) return;
    const url = inputRef.current.value;
    exportRDFToPod(url);
    onExported();
  };

  return (
    <>
      <h4>ExportComponent</h4>
      <div><button type="button" onClick={processExportToLocal}>export to local</button></div>
      <div style={{display:'flex',margin:'1em 0'}}>
        <button type="button" onClick={processExportToPod}>export to pod</button>
        <input type="text" ref={inputRef} style={{flexGrow:1}}/>
      </div>
    </>
  );
}

export default ExportComponent;
