import { useState } from 'react';
import { myLogin, myLogout, webId as id, loadDefaultIdp } from './util';
import MyDialog from './MyDialog';

const LoginPane: React.FC = () => {
  const [ webId, setWebId ] = useState(id);
  const [ idp, setIdp ] = useState(loadDefaultIdp());
  const [ dialogOpen, setDialogOpen ] = useState(false);

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
    setDialogOpen(false); // MyDialog消すため。でもなぜか効果無し。
  };

  return (
    <>
      <p>WebID: {webId} <button onClick={()=>{setDialogOpen(true);}}>login or logout</button></p>
      <MyDialog isVisible={dialogOpen} setVisible={setDialogOpen}>
        <p>ダイアログ</p>
        <input type="text" value={idp} onChange={handleIdpChange} />
        <button onClick={processLogin}>Login</button>
        <button onClick={processLogout}>Logout</button>
      </MyDialog>
    </>
  )
}

export default LoginPane;
