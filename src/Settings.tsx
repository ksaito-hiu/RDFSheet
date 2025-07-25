import React, { useState, useEffect, useRef } from 'react';
import styles from './Settings.module.css';
import MyDialog from './MyDialog';
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
  const [ isImportPrefixOpen, setImportPrefixOpen ] = useState(false);
  const [ currentSheet, setCurrentSheet ] = useState<Setting>(settings[0]);
  const [ sheetIdx, setSheetIdx ] = useState<string>('iTha4zah'); // 適当
  const [ sheetType, setSheetType ] = useState<SheetType>('repetitive-embedding');
  const [ sheetSettingsChanged, setSheetSettingsChanged ] = useState(false);
  const sheetRepRangeTB = useRef<HTMLInputElement>(null);
  const sheetPrefixesTA = useRef<HTMLTextAreaElement>(null);
  const sheetTemplateTA = useRef<HTMLTextAreaElement>(null);
  const sheetFileURLTB = useRef<HTMLInputElement>(null);
  const sheetRdfURLTB = useRef<HTMLInputElement>(null);
  const { appData } = useAppData();

  useEffect(() => {
    const selected: string | null = settings.reduce(
      (acc: string | null, cur: Setting) => acc!==null?acc:((cur.status===1)?cur.index:acc),
      null
    );
    changeSelectedSheet(selected);
  }, [settings]);

  const changeSelectedSheet = (idx: string | null) => {
    if (sheetSettingsChanged)
      if (!(window.confirm("設定を保存せずにシートを変更しますか？")))
        return;

    setSheetSettingsChanged(false);
    const selected: Setting | null = settings.reduce(
      (acc: Setting | null, cur: Setting) => acc!==null?acc:((cur.index===idx)?cur:acc),
      null
    );
    if (selected) {
      setCurrentSheet(selected);
      setSheetIdx(selected.index);
      setSheetType(selected.sheetType);
      if (sheetRepRangeTB.current) sheetRepRangeTB.current.value = selected.repRange;
      if (sheetPrefixesTA.current) sheetPrefixesTA.current.value = selected.prefixes;
      if (sheetTemplateTA.current) sheetTemplateTA.current.value = selected.template;
      if (sheetFileURLTB.current) sheetFileURLTB.current.value = selected.fileURL;
      if (sheetRdfURLTB.current) sheetRdfURLTB.current.value = selected.rdfURL;
    } else {
      console.log(`GAHA: There is no sheet: index=${idx}???`);
    }
    
  };

  const handleSheetTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSheetType((event.target.value as SheetType));
    setSheetSettingsChanged(true);
  };

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
    if (sheetRepRangeTB.current) sheetRepRangeTB.current.value = selected.range;
    setSheetSettingsChanged(true);
  };

  const importPrefix = (e: any) => {
    if (!(sheetPrefixesTA.current)) return;
    if (!(sheetPrefixesTA.current.value.endsWith('\n')))
      sheetPrefixesTA.current.value += '\n';
    sheetPrefixesTA.current.value += e.target.textContent;
    setSheetSettingsChanged(true);
    setImportPrefixOpen(false);
  };

  const saveCurrentSheetSettings = () => {
    currentSheet.sheetType = sheetType;
    if (sheetRepRangeTB.current) currentSheet.repRange = sheetRepRangeTB.current.value;
    if (sheetPrefixesTA.current) currentSheet.prefixes = sheetPrefixesTA.current.value;
    if (sheetTemplateTA.current) currentSheet.template = sheetTemplateTA.current.value;
    if (sheetFileURLTB.current) currentSheet.fileURL = sheetFileURLTB.current.value;
    if (sheetRdfURLTB.current) currentSheet.rdfURL = sheetRdfURLTB.current.value;
    onChange(settings);
    setSheetSettingsChanged(false);
    alert("シートの設定を保存しました。");
  };

  return(
    <div className={styles.allSettings}>
      <div className={styles.title}>ファイル設定</div>
      <div className={styles.selectedSheetDiv}>
       <label>設定するシート: 
         <select value={sheetIdx} onChange={(e)=>changeSelectedSheet(e.target.value)} name="selectedSheet">
           {settings.map((setting) => (
             <option value={setting.index} key={setting.index}>{setting.name}</option>
           ))}
         </select>
         <span style={{color: sheetSettingsChanged ? 'red' : 'black' }}>
           {sheetSettingsChanged ? 'シート設定変更あり' : 'シート設定変更なし'}
         </span>
         <button className={styles.saveBtn} onClick={saveCurrentSheetSettings}>設定保存</button>
       </label>
      </div>
      <div className={styles.typeSelect}>
        <div className={styles.sheetType}>
          <label>
            <input type="radio"
                   name="sheetType"
                   value="repetitive-embedding"
                   checked={sheetType==='repetitive-embedding'}
                   onChange={handleSheetTypeChange}/>反復埋め込み
            <div className={styles.repRangeDiv}>
              反復範囲:
              <input ref={sheetRepRangeTB} type="text" defaultValue={currentSheet.repRange}/>
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
                   onChange={handleSheetTypeChange}/>単純埋め込み
          </label>
        </div>
      </div>
      <div className={styles.convFuncsDiv}>
        <h4>変換関数</h4>
        <p>未実装。</p>
      </div>
      <div className={styles.prefixDiv}>
        <h4>
          プレフィックス
          <span className={styles.glue}></span>
          <button id="importPrefixBtn"
                  className={styles.importPrefixBtn}
                  onClick={()=>setImportPrefixOpen(true)}>
            プレフィックスを取り込む
          </button>
          <MyDialog isVisible={isImportPrefixOpen}
                    onClose={()=>setImportPrefixOpen(false)}>
            <p>取り込みたいプレフィックスをクリックして下さい。</p>
            { appData.prefixes.split("\n").map((line) => {
              return <p onClick={importPrefix}>{line}</p>;
            })}
          </MyDialog>
        </h4>
        <textarea ref={sheetPrefixesTA}
                  defaultValue={currentSheet.prefixes}
                  className={styles.prefixTA}/>
      </div>
      <div>
        <h4>テンプレート</h4>
        <textarea ref={sheetTemplateTA}
                  defaultValue={currentSheet.template}
                  className={styles.templateTA}/>
      </div>
      <div className={styles.pathDiv}>
        <label htmlFor="fileURLTB">ファイルURL</label>
        <input ref={sheetFileURLTB} type="text" defaultValue={currentSheet.fileURL}/>
        <label htmlFor="rdfURLTB">RDF URL</label>
        <input ref={sheetRdfURLTB} type="text" defaultValue={currentSheet.rdfURL}/>
      </div>
    </div>
  );
};

export default Settings;
