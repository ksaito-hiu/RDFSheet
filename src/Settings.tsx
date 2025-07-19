import React, { useState, useEffect } from 'react';
import MyDialog from './MyDialog';
import type { SheetType, Setting } from './util';

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
  const [ currentSheet, setCurrentSheet ] = useState(settings[0]);
  const [ sheetIdx, setSheetIdx ] = useState<string>('iTha4zah'); // 適当
  const [ sheetType, setSheetType ] = useState<SheetType>('repetitive-embedding');
  const [ sheetRepRange, setSheetRepRange ] = useState('');
  const [ sheetPrefixes, setSheetPrefixes ] = useState('');
  const [ sheetTemplate, setSheetTemplate ] = useState('');
  const [ sheetFileURL, setSheetFileURL ] = useState('');
  const [ sheetRdfURL, setSheetRdfURL ] = useState('');

  useEffect(() => {
console.log(`GAHA0000000000000: ${JSON.stringify(settings,null,2)}`);
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

  return(
    <>
      <h3>Settings</h3><button onClick={()=>setAppSettingsOpen(true)}>アプリ設定</button>
      <MyDialog isVisible={isAppSettingsOpen} onClose={()=>setAppSettingsOpen(false)}>
        <p>アプリ設定。未完！</p>
      </MyDialog>
      <select value={sheetIdx} onChange={(e)=>changeSelectedSheet(e.target.value)} name="selectedSheet">
        {settings.map((setting) => (
          <option value={setting.index} key={setting.index}>{setting.name}</option>
        ))}
      </select>
      <div>
        <div>
          <input type="radio"
                 name="sheetType"
                 value="repetitive-embedding"
                 checked={sheetType==='repetitive-embedding'}
                 onChange={changeSheetType}/>反復埋め込み
          範囲: <input type="text" value={sheetRepRange} onChange={changeSheetRepRange}/>
        </div>
        <div>
          <input type="radio"
                 name="sheetType"
                 value="simple-embedding"
                 checked={sheetType==='simple-embedding'}
                 onChange={changeSheetType}/>単純埋め込み
        </div>
      </div>
      <div>
        <p>プレフィックス</p>
        <textarea value={sheetPrefixes} onChange={changeSheetPrefixes}/>
      </div>
      <div>
        <p>テンプレート</p>
        <textarea value={sheetTemplate} onChange={changeSheetTemplate}/>
      </div>
      <div>
        <p>ファイルURL: <input type="text" value={sheetFileURL} onChange={changeSheetFileURL}/></p>
        <p>RDF URL: <input type="text" value={sheetRdfURL} onChange={changeSheetRdfURL}/></p>
      </div>
    </>
  );
};

export default Settings;
