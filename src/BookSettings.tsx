import React, { useState, useEffect, useRef } from 'react';
import styles from './BookSettings.module.css';
import type { Settings } from './util';

/*
 * Excelで言うところのBook全体に関する設定画面
 */

type Props = {
  settings: Settings;
  onChange: (ss: Settings) => void;
};

const BookSettings: React.FC<Props> = ({ settings, onChange }) => {
  const [ isSettingsChanged, setSettingsChanged ] = useState(false);
  const sheetPodURLTB = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sheetPodURLTB) {
      sheetPodURLTB;
    }
  }, [settings]);

  const fileSettingIsChanged = () => {
    setSettingsChanged(true);
  };

  const saveCurrentSheetSettings = () => {
    if (sheetPodURLTB.current) settings.fileSettings.podUrl = sheetPodURLTB.current.value;
    onChange(settings);
    setSettingsChanged(false);
    alert("シートの設定を変更しました。");
  };

  return(
    <div className={styles.allBookSettings}>
      <div className={styles.title}>
        <h3>Book設定</h3>
        <p>Excelで言うところのBook（つまり複数のシートを含むファイル全体）の設定。</p>
        <p>
          <span style={{color: isSettingsChanged ? 'red' : 'black' }}>
            {isSettingsChanged ? 'Book設定修正あり' : 'Book設定修正なし'}
          </span>
          <button className={styles.saveBtn}
                  onClick={saveCurrentSheetSettings}
                  disabled={!isSettingsChanged}>設定変更</button>
        </p>
        <div className={styles.filePathDiv}>
          <label htmlFor="fileURLTB">ファイルURL</label>
          <input ref={sheetPodURLTB} type="text" defaultValue={settings.fileSettings.podUrl} onChange={fileSettingIsChanged}/>
        </div>
      </div>
     </div>
  );
};

export default BookSettings;
