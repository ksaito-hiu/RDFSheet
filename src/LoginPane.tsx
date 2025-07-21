import { useState } from 'react';
import { myLogin, myLogout, webId as id } from './util';
import MyDialog from './MyDialog';
import { useAppData } from "./AppDataContext";

const LoginPane: React.FC = () => {
  const { appData, updateAppData } = useAppData();
  const [ webId, setWebId ] = useState(id);
  const [ idp, setIdp ] = useState(appData?(appData.idp?appData.idp:'https://solidcommunity.net'):'https://solidcommunity.net');
  const [ dialogOpen, setDialogOpen ] = useState(false);

  const handleIdpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdp(e.target.value);
  };

  const processLogin: ()=>void = async () => {
    updateAppData({idp}); // ログイン前だけどこのタイミングしか・・・
    await myLogin(idp);
    // 以下リダイレクションするので意味ない？
    setWebId(id);
    setDialogOpen(false);
  };

  const processLogout: ()=>void = () => {
    myLogout();
    setWebId('not logged in');
    setDialogOpen(false); // MyDialog消すため
  };

  return (
    <>
      <p>WebID: {webId} <button onClick={()=>{setDialogOpen(true);}}>login or logout</button></p>
      <MyDialog isVisible={dialogOpen} onClose={()=>setDialogOpen(false)}>
        <p>ダイアログ</p>
        <input type="text" value={idp} onChange={handleIdpChange} />
        <button onClick={processLogin}>Login</button>
        <button onClick={processLogout}>Logout</button>
      </MyDialog>
    </>
  )
}

export default LoginPane;
