import { useEffect, useState } from 'react';
import { myLogin, myLogout, webId as id } from './util';
import MyDialog from './MyDialog';
import { useAppData } from "./AppDataContext";

const LoginPane: React.FC = () => {
  const { appData, updateAppData } = useAppData();
  const [ isLoggedIn, setLoggedIn ] = useState(id===null?false:true);
  const [ webId, setWebId ] = useState(id===null?'not logged in':id);
  const [ idp, setIdp ] = useState('https://solidcommunity.net');
  const [ dialogOpen, setDialogOpen ] = useState(false);

  useEffect(()=>{
    const adIdp = appData?(appData.idp?appData.idp:'https://solidcommunity.net'):'https://solidcommunity.net';
    setIdp(adIdp);
  },[appData]);

  const handleIdpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdp(e.target.value);
  };

  const processLogin: ()=>void = async () => {
    updateAppData({idp}); // ログイン前だけどこのタイミングしか・・・
    await myLogin(idp);
    // 以下リダイレクションするので意味ない？
    setWebId(id===null?'not logged in':id);
    setDialogOpen(false);
  };

  const processLogout: ()=>void = () => {
    myLogout();
    setLoggedIn(false);
    setWebId('not logged in');
    setDialogOpen(false); // MyDialog消すため
  };

  return (
    <>
      <p>
        <button onClick={()=>{setDialogOpen(true);}}>
          { isLoggedIn ? 'logout or relogin' : 'login' }
        </button>
        <span style={{marginLeft:'1em'}}>WebID: {webId}</span>
      </p>
      <MyDialog isVisible={dialogOpen} onClose={()=>setDialogOpen(false)}>
        <h4>ログイン・ログアウト</h4>
        <p>ログインしたい時はidpに認証サーバを直接入力するか、代表的な認証サーバのボタンを押し「Login」ボタンを押して下さい。ログアウトしたい時は「Logout」ボタンを押して下さい。</p>
        <div style={{display:'flex'}}>
          idp: <input type="text" value={idp} onChange={handleIdpChange} style={{flexGrow:1}}/>
          <button onClick={processLogin}>Login</button>
        </div>
        <ul>
          <li><button onClick={()=>{setIdp('https://solidcommunity.net');}}>Solid Community</button></li>
          <li><button onClick={()=>{setIdp('https://solidweb.me');}}>solidweb.me</button></li>
          <li><button onClick={()=>{setIdp('https://solidweb.org');}}>solidweb.org</button></li>
          <li><button onClick={()=>{setIdp('https://login.inrupt.com');}}>Inrupt Identity Provider</button></li>
        </ul>
        <p><button onClick={processLogout}>Logout</button></p>
      </MyDialog>
    </>
  )
}

export default LoginPane;
