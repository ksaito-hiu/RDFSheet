import { useRef, useEffect } from 'react';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const MyDialog: React.FC<Props> = ({ isVisible, onClose, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.addEventListener('close', handleClose);
    return ()=>dialog.removeEventListener('close', handleClose);
  },[]);

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

  return (isVisible ?
    (
      <dialog ref={dialogRef} style={{zIndex:3000}}>
        <div style={{border:'black'}}>
          {children}
        </div>
        <button onClick={()=>dialogRef.current?.close()}>close</button>
      </dialog>
    ) : null
  );
};

export default MyDialog;
