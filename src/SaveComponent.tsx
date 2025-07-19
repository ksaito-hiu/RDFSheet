import { useRef } from 'react';
import { saveSheetsToLocal, saveSheetsToPod } from './util';

type Props = {
  onSaved: () => void;
};

const SaveComponent: React.FC<Props> = ({ onSaved }) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
      <p>SaveComponent</p>
      <button type="button" onClick={processSaveToLocal}>save to local</button>
      <input type="text"/>
      <button type="button" onClick={processSaveToPod}>save to pod</button>
    </>
  );
}

export default SaveComponent;
