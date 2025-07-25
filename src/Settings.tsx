import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import MyDialog from './MyDialog';
import AppSettings from './AppSettings';
import { getSelectedRange } from './util';
import type { SheetType, Setting } from './util';
import { useAppData } from './AppDataContext';

/*
 * 設定画面のコンポーネント。デフォルトでLuckySheetのUIが
 * 先に表示済みで、このSettingsコンポーネットが表示される
 * タイミングでは設定のデータが読み込まれて準備が整っている
 * ことが前提になっている。また、このコンポーネントはApp.tsx
 * にてisSettingsActive===trueの時だけマウントされるのだが、
 * そのマウントのタイミングでLuckySheetのシートの追加・削除、
 * シート名変更などに対応する設定の更新をする。美しくない気が
 * するけど、今のところそんな仕組みだというのが重要。ただ、
 * その実装はutil.tsのupdateSettings関数に書いて、App.tsxの
 * 中で呼びだす形になっている。
 */

type Props = {
  settings: Setting[];
  onChange: (ss: Setting[]) => void;
};

const Settings: React.FC<Props> = ({ settings, onChange }) => {
  const [ isAppSettingsOpen, setAppSettingsOpen ] = useState(false);
  const [ isImportPrefixOpen, setImportPrefixOpen ] = useState(false);
  const [ currentSheet, setCurrentSheet ] = useState(settings[0]);
  const [ sheetIdx, setSheetIdx ] = useState<string>('iTha4zah'); // 適当
  const [ sheetType, setSheetType ] = useState<SheetType>('repetitive-embedding');
  const [ sheetRepRange, setSheetRepRange ] = useState('');
  const [ sheetPrefixes, setSheetPrefixes ] = useState('');
  const [ sheetTemplate, setSheetTemplate ] = useState('');
  const [ sheetFileURL, setSheetFileURL ] = useState('');
  const [ sheetRdfURL, setSheetRdfURL ] = useState('');
  const { appData, /* updateAppData */ } = useAppData();

  useEffect(() => {
    const selected: string | null = settings.reduce(
      (acc: string | null, cur: Setting) => acc!==null?acc:((cur.status===1)?cur.index:acc),
      null
    );
    changeSelectedSheet(selected);
  }, [settings]);

  const changeSelectedSheet = (idx: string | null) => {
    const selected: Setting | null = settings.reduce(
      (acc: Setting | null, cur: Setting) => acc!==null?acc:((cur.index===idx)?cur:acc),
      null
    );
    if (selected) {
      setCurrentSheet(selected);
      setSheetIdx(selected.index);
      setSheetType(selected.sheetType);
      setSheetRepRange(selected.repRange);
      setSheetPrefixes(selected.prefixes);
      setSheetTemplate(selected.template);
      setSheetFileURL(selected.fileURL);
      setSheetRdfURL(selected.rdfURL);
    } else {
      console.log(`GAHA: There is no sheet: index=${idx}???`);
    }
    
  };

  const changeSheetType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = e.target.value as SheetType;
    currentSheet.sheetType = t;
    setSheetType(t);
    onChange(settings);
  }

  const changeSheetRepRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    currentSheet.repRange = e.target.value;
    setSheetRepRange(e.target.value);
    onChange(settings);
  }

  const changeSheetPrefixes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    currentSheet.prefixes = e.target.value;
    setSheetPrefixes(e.target.value);
    onChange(settings);
  }

  const changeSheetTemplate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    currentSheet.template = e.target.value;
    setSheetTemplate(e.target.value);
    onChange(settings);
  }

  const changeSheetFileURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    currentSheet.fileURL = e.target.value;
    setSheetFileURL(e.target.value);
    onChange(settings);
  }

  const changeSheetRdfURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    currentSheet.rdfURL = e.target.value;
    setSheetRdfURL(e.target.value);
    onChange(settings);
  }

  const importRepRange = () => {
    const selected = getSelectedRange();
    if (selected.sheetIdx !== sheetIdx) {
      alert(`設定中のシートと、現在アクティブなシートが異なっているので取り込みを中止します。`);
      return;
    }
    if (selected.range.indexOf(':')<0) {
      alert(`範囲が選択されていなかったので取り込みを中止します。`);
      return;
    }
    setSheetRepRange(selected.range);
  };
  const importPrefix = (e: any) => {
console.log(`GAHA: `,e.target.textContent);
    setSheetPrefixes(sheetPrefixes+e.target.textContent);
    setImportPrefixOpen(false);
  };

  return(
    <div className={styles.allSettings}>
      <div className={styles.title}>
        <span>Settings</span>
        <span className={styles.glue}> </span>
        <button onClick={()=>setAppSettingsOpen(true)}>アプリ設定</button>
      </div>
      <MyDialog isVisible={isAppSettingsOpen} onClose={()=>setAppSettingsOpen(false)}>
        <AppSettings onChanged={()=>setAppSettingsOpen(false)}/>
      </MyDialog>
      <label>設定するシート: 
        <select value={sheetIdx} onChange={(e)=>changeSelectedSheet(e.target.value)} name="selectedSheet">
          {settings.map((setting) => (
            <option value={setting.index} key={setting.index}>{setting.name}</option>
          ))}
        </select>
      </label>
      <div className={styles.typeSelect}>
        <div className={styles.sheetType}>
          <label>
            <input id="sheetTypeTI"
                   type="radio"
                   name="sheetType"
                   value="repetitive-embedding"
                   checked={sheetType==='repetitive-embedding'}
                   onChange={changeSheetType}/>反復埋め込み
            <div className={styles.repRangeDiv}>
              反復範囲:
              <input type="text" value={sheetRepRange} onChange={changeSheetRepRange}/>
              <button type="button" onClick={importRepRange}>選択範囲から取り込み</button>
            </div>
          </label>
        </div>
        <div className={styles.simpleType}>
          <label>
            <input type="radio"
                   name="sheetType"
                   value="simple-embedding"
                   checked={sheetType==='simple-embedding'}
                   onChange={changeSheetType}/>単純埋め込み
          </label>
        </div>
      </div>
      <div className={styles.prefixDiv}>
        <h4>
          プレフィックス
          <span className={styles.glue}></span>
          <button id="importPrefixBtn"
                  className={styles.importPrefixBtn}
                  onClick={()=>setImportPrefixOpen(true)}>プレフィックスを取り込む</button>
          <MyDialog isVisible={isImportPrefixOpen} onClose={()=>setImportPrefixOpen(false)}>
            <p>取り込みたいプレフィックスをクリックして下さい。</p>
            { appData.prefixes.split("\n").map((line) => {
              return <p onClick={importPrefix}>{line}</p>;
            })}
          </MyDialog>
        </h4>
        <textarea value={sheetPrefixes} onChange={changeSheetPrefixes} className={styles.prefixTA}/>
      </div>
      <div>
        <h4>テンプレート</h4>
        <textarea value={sheetTemplate} onChange={changeSheetTemplate} className={styles.templateTA}/>
      </div>
      <div className={styles.pathDiv}>
        <label htmlFor="fileURLTB">ファイルURL</label><input id="fileURLTB" type="text" value={sheetFileURL} onChange={changeSheetFileURL}/>
        <label htmlFor="rdfURLTB">RDF URL</label><input id="rdfURLTB" type="text" value={sheetRdfURL} onChange={changeSheetRdfURL}/>
      </div>
    </div>
  );
};

export default Settings;
