import { useRef } from 'react';
import { saveSheetsToLocal, saveSheetsToPod } from './util';

type Props = {
  onSaved: () => void;
};

const SaveComponent: React.FC<Props> = ({ onSaved }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const processSaveFromLocal = () => {
    saveSheetsToLocal();
    onSaved();
  };

  const processSaveFromPod = () => {
    if (!(inputRef.current)) return;
    const url = inputRef.current.value;
    saveSheetsToPod(url);
    onSaved();
  };

  return (
    <>
      <p>SaveComponent</p>
      <button type="button" onClick={processSaveFromLocal}>save from local</button>
      <input type="text"/>
      <button type="button" onClick={processSaveFromPod}>save from pod</button>
    </>
  );
}

export default SaveComponent;
