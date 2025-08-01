import React, { useRef } from 'react';
import styles from './AppSettings.module.css';
import { useAppData } from './AppDataContext';

const AppSettings: React.FC = () => {
  const { appData, updateAppData } = useAppData();
  const prefixesTA = useRef<HTMLTextAreaElement>(null);
  const idpTB = useRef<HTMLInputElement>(null);

  const changeAppSettings = () => {
    const newData = {
      prefixes: prefixesTA.current?.value,
      idp: idpTB.current?.value
    };
    updateAppData(newData);
    alert("アプリ設定を保存しました。");
  };

  return(
    <div className={styles.allAppSettings}>
      <h3>AppSettings</h3>
      <p>編集中のファイルではなくアプリの設定をします。</p>
      <h4>プレフィックス</h4>
      <div className={styles.prefixesDiv}>
        <textarea ref={prefixesTA} className={styles.prefixesTA} defaultValue={appData.prefixes}></textarea>
      </div>
      <h4>デフォルトのログイン場所</h4>
      <div className={styles.idpDiv}>
        <input ref={idpTB} className={styles.idpTB} defaultValue={appData.idp}/>
      </div>
      <button onClick={changeAppSettings}>変更</button>
    </div>
  );
};

export default AppSettings;
