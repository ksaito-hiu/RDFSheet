import { useRef, useEffect } from 'react';

type Props = {
  isVisible: boolean;
  setVisible: (isVisible:boolean) => void;
  children: React.ReactNode;
};

const MyDialog: React.FC<Props> = ({ isVisible, setVisible, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isVisible)
      if (!dialog.open)
        dialog.showModal();
    else
      if (dialog.open)
        dialog.close();
  },[isVisible]);

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener('close', handleClose);
    return ()=>dialog.removeEventListener('close', handleClose);
  },[setVisible]);

  return (
    <dialog ref={dialogRef} style={{zIndex:3000}}>
      <div style={{border:'black'}}>
        {children}
      </div>
      <button onClick={()=>dialogRef.current?.close()}>close</button>
    </dialog>
  );
};

export default MyDialog;
