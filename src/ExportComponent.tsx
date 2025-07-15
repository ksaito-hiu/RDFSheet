import { useRef } from 'react';
import { exportRDFToLocal, exportRDFToPod } from './util';

type Props = {
  onExported: () => void;
};

const ExportComponent: React.FC<Props> = ({ onExported }) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
      <p>ExportComponent</p>
      <button type="button" onClick={processExportToLocal}>export to local</button>
      <input type="text"/>
      <button type="button" onClick={processExportToPod}>export to pod</button>
    </>
  );
}

export default ExportComponent;
