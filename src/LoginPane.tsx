import { useState } from 'react';
import { myLogin, myLogout, webId as id, loadDefaultIdp } from './util';

const LoginPane: React.FC = () => {
  const [ webId, setWebId ] = useState(id);
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const [ idp, setIdp ] = useState(loadDefaultIdp());

  const handleIdpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdp(e.target.value);
  };

  const processLogin: ()=>void = async () => {
    await myLogin(idp);
    // 以下リダイレクションするので意味ない？
    setWebId(id);
    setDialogOpen(false);
  };

  const processLogout: ()=>void = () => {
    myLogout();
    setWebId('not logged in');
    setDialogOpen(false);
  };

  return (
    <>
      <p>WebID: {webId} <button onClick={()=>{setDialogOpen(true);}}>login or logout</button></p>
      <dialog open={dialogOpen} style={{zIndex:3000}}>
        <p>ダイアログ</p>
        <input type="text" value={idp} onChange={handleIdpChange} />
        <button onClick={processLogin}>Login</button>
        <button onClick={processLogout}>Logout</button>
      </dialog>
    </>
  )
}

export default LoginPane;
