import { useRef } from 'react';
import { loadSheetsFromLocal, loadSheetsFromPod } from './util';

type Props = {
  onLoaded: () => void;
};

const LoadComponent: React.FC<Props> = ({ onLoaded }) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
      <p>LoadComponent</p>
      <button type="button" onClick={processLoadFromLocal}>load from local</button>
      <input type="text"/>
      <button type="button" onClick={processLoadFromPod}>load from pod</button>
    </>
  );
}

export default LoadComponent;
