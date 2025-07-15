import { useRef } from 'react';
import { importRDFFromLocal, importRDFFromPod } from './util';

type Props = {
  onImported: () => void;
};

const ImportComponent: React.FC<Props> = ({ onImported }) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
      <p>ImportComponent</p>
      <button type="button" onClick={processImportFromLocal}>import from local</button>
      <input type="text"/>
      <button type="button" onClick={processImportFromPod}>import from pod</button>
    </>
  );
}

export default ImportComponent;
