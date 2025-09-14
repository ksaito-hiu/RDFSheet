import React, { useState, useRef, useEffect } from 'react';
import styles from './AppSettings.module.css';
import { useAppData } from './AppDataContext';
import type { ClientID } from './AppDataContext';

const AppSettings: React.FC = () => {
  const [ isSettingsChanged, setSettingsChanged ] = useState(false);
  const [ newClientIDs, setNewClientIDs ] = useState<ClientID[]>([]);
  const { appData, updateAppData } = useAppData();
  const prefixesTA = useRef<HTMLTextAreaElement>(null);
  const idpTB = useRef<HTMLInputElement>(null);
  const clientNameTB = useRef<HTMLInputElement>(null);
  const providerTB = useRef<HTMLInputElement>(null);
  const clientIdTB = useRef<HTMLInputElement>(null);
  const clientSecretTB = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNewClientIDs([...appData.clientIDs]);
  },[appData]);

  const changeSomething = () => {
    setSettingsChanged(true);
  };

  const addClientID = () => {
    const ncs = newClientIDs.filter((c)=>c.name!==clientNameTB.current?.value);
    const id0 = clientIdTB.current ? clientIdTB.current.value : 'undefined';
    const secret0 = clientSecretTB.current ? clientSecretTB.current.value : 'undefined';
    const c = {
      name: clientNameTB.current ? clientNameTB.current.value : 'undefined',
      provider: providerTB.current ? providerTB.current.value : 'undefined',
      id: btoa(id0),
      secret: btoa(secret0)
    }
    setNewClientIDs([...ncs, c]);
    setSettingsChanged(true);
  };

  const removeClientID = () => {
    setNewClientIDs(newClientIDs.filter((c)=>c.name!==clientNameTB.current?.value));
    setSettingsChanged(true);
  };

  const saveAppSettings = () => {
    const newData = {
      prefixes: prefixesTA.current?.value,
      idp: idpTB.current?.value,
      clientIDs: newClientIDs
    };
    updateAppData(newData);
    setSettingsChanged(false);
    alert("アプリ設定を保存しました。");
  };

  return(
    <div className={styles.allAppSettings}>
      <h2>AppSettings</h2>
      <p>編集中のファイルではなくアプリの設定をします。</p>
      <p>
        <span style={{color: isSettingsChanged ? 'red' : 'black' }}>
          {isSettingsChanged ? 'App設定修正あり' : 'App設定修正なし'}
        </span>
        <button onClick={saveAppSettings}>設定変更</button>
      </p>
      <h4>プレフィックス</h4>
      <div className={styles.prefixesDiv}>
        <textarea ref={prefixesTA} className={styles.prefixesTA}
                  defaultValue={appData.prefixes} onChange={changeSomething}></textarea>
      </div>
      <h4>デフォルトのログイン場所</h4>
      <div className={styles.idpDiv}>
        <input ref={idpTB} className={styles.idpTB}
               defaultValue={appData.idp} onChange={changeSomething}/>
      </div>
      <h4>クライアントシークレットが必要な場合</h4>
      <h5>クライアント設定の追加</h5>
      <p>
        <label>name:<input type="text" ref={clientNameTB}/></label>
        <label>provider:<input type="text" ref={providerTB}/></label>
        <label>id:<input type="text" ref={clientIdTB}/></label>
        <label>secret:<input type="text" ref={clientSecretTB}/></label>
        <button onClick={addClientID}>追加</button>
      </p>
      <h5>クライアント設定の削除</h5>
      <p>
        <select>
          {newClientIDs.map((c,idx) => (
            <option value={c.name} key={idx}>{c.name}</option>
          ))}
        </select>
        <button onClick={removeClientID}
                disabled={newClientIDs.length===0}>削除</button>
      </p>
    </div>
  );
};

export default AppSettings;
