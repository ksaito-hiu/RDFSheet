import React, { useState, useEffect, useRef } from 'react';
import styles from './Export.module.css';
import MyDialog from './MyDialog';
import { getSelectedRange } from './util';
import type { Setting, Settings } from './util';
import ImportComponent from './ImportComponent';

/*
 * RDFからのインポートの設定と実際の画面のインポートをするための
 * コンポーネント。デフォルトでLuckySheetのUIが
 * 先に表示済みで、このコンポーネットが表示される
 * タイミングでは設定のデータが読み込まれて準備が整っている
 * ことが前提になっている。また、このコンポーネントはApp.tsx
 * にてisImportActive===trueの時だけマウントされるのだが、
 * そのマウントのタイミングでLuckySheetのシートの追加・削除、
 * シート名変更などに対応する設定の更新をする。美しくない気が
 * するけど、今のところそんな仕組みだというのが重要。ただ、
 * その実装はutil.tsのupdateSettings関数に書いて、App.tsxの
 * 中で呼びだす形になっている。
 */

type Props = {
  settings: Settings;
  onChange: (ss: Settings) => void;
};

const Export: React.FC<Props> = ({ settings, onChange }) => {
  const [ currentSheet, setCurrentSheet ] = useState<Setting>(settings.sheets[0]);
  const [ sheetIdx, setSheetIdx ] = useState<string>('iTha4zah'); // 適当
  const [ sheetSettingsChanged, setSheetSettingsChanged ] = useState(false);
  const [isImportOpen, setImportOpen] = useState(false);
  const sheetPodURLTB = useRef<HTMLInputElement>(null);
  const sheetRepRangeTB = useRef<HTMLInputElement>(null);
  const sheetPrefixesTA = useRef<HTMLTextAreaElement>(null);
  const sheetOneTimeTemplateTA = useRef<HTMLTextAreaElement>(null);
  const sheetIterationTemplateTA = useRef<HTMLTextAreaElement>(null);
  const sheetAdditionalImportUrlsTA = useRef<HTMLTextAreaElement>(null);
  const sheetOneTimeImportSparqlTA = useRef<HTMLTextAreaElement>(null);
  const sheetIterationImportSparqlTA = useRef<HTMLTextAreaElement>(null);
  const sheetRdfURLTB = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const selected: string | null = settings.sheets.reduce(
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
    const selected: Setting | null = settings.sheets.reduce(
      (acc: Setting | null, cur: Setting) => acc!==null?acc:((cur.index===idx)?cur:acc),
      null
    );
    if (selected) {
      setCurrentSheet(selected);
      setSheetIdx(selected.index);
      if (sheetRepRangeTB.current) sheetRepRangeTB.current.value = selected.repRange;
      if (sheetPrefixesTA.current) sheetPrefixesTA.current.value = selected.prefixes;
      if (sheetOneTimeTemplateTA.current) sheetOneTimeTemplateTA.current.value = selected.oneTimeTemplate;
      if (sheetIterationTemplateTA.current) sheetIterationTemplateTA.current.value = selected.iterationTemplate;
      if (sheetAdditionalImportUrlsTA.current) sheetAdditionalImportUrlsTA.current.value = selected.additionalImportUrls;
      if (sheetOneTimeImportSparqlTA.current) sheetOneTimeImportSparqlTA.current.value = selected.oneTimeImportSparql;
      if (sheetIterationImportSparqlTA.current) sheetIterationImportSparqlTA.current.value = selected.iterationImportSparql;
      if (sheetRdfURLTB.current) sheetRdfURLTB.current.value = selected.rdfPodUrl;
    } else {
      console.log(`GAHA: There is no sheet: index=${idx}???`);
    }
    
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

  const repSettingIsChanged = () => {
    if (!(sheetRepRangeTB.current)) return;
    setSheetSettingsChanged(true);
  };

  const someSettingIsChanged = () => {
    setSheetSettingsChanged(true);
  };

  const saveCurrentSheetSettings = () => {
    if (sheetPodURLTB.current) settings.fileSettings.podUrl = sheetPodURLTB.current.value;
    if (sheetRepRangeTB.current) currentSheet.repRange = sheetRepRangeTB.current.value;
    if (sheetPrefixesTA.current) currentSheet.prefixes = sheetPrefixesTA.current.value;
    if (sheetOneTimeTemplateTA.current) currentSheet.oneTimeTemplate = sheetOneTimeTemplateTA.current.value;
    if (sheetIterationTemplateTA.current) currentSheet.iterationTemplate = sheetIterationTemplateTA.current.value;
    if (sheetAdditionalImportUrlsTA.current) currentSheet.additionalImportUrls = sheetAdditionalImportUrlsTA.current.value;
    if (sheetOneTimeImportSparqlTA.current) currentSheet.oneTimeImportSparql = sheetOneTimeImportSparqlTA.current.value;
    if (sheetIterationImportSparqlTA.current) currentSheet.iterationImportSparql = sheetIterationImportSparqlTA.current.value;
    if (sheetRdfURLTB.current) currentSheet.rdfPodUrl = sheetRdfURLTB.current.value;
    onChange(settings);
    setSheetSettingsChanged(false);
    alert("シートの設定を変更しました。");
  };

  return(
    <div className={styles.allSettings}>
      <h1>インポート</h1>
      <div className={styles.selectedSheetDiv}>
        <label>設定するシート: 
          <select value={sheetIdx} onChange={(e)=>changeSelectedSheet(e.target.value)} name="selectedSheet">
            {settings.sheets.map((setting) => (
              <option value={setting.index} key={setting.index}>{setting.name}</option>
            ))}
          </select>
          <span style={{color: sheetSettingsChanged ? 'red' : 'black' }}>
            {sheetSettingsChanged ? 'シートのインポート設定の変更あり' : 'シートのインポート設定の変更なし'}
          </span>
          <button className={styles.saveBtn}
                  onClick={saveCurrentSheetSettings}
                  disabled={!sheetSettingsChanged}>設定変更</button>
          <button onClick={()=>setImportOpen(true)}>インポート</button>
        </label>
      </div>
      <div className={styles.repRangeDiv}>
        反復範囲(エクスポートとの共通設定):
        <input ref={sheetRepRangeTB} type="text" defaultValue={currentSheet.repRange} onChange={repSettingIsChanged}/>
        <button type="button" onClick={importRepRange}>選択範囲から取り込み</button>
      </div>
      <div>
        <h4>追加インポートRDFのURL</h4>
        <textarea ref={sheetAdditionalImportUrlsTA}
                  defaultValue={currentSheet.additionalImportUrls}
                  className={styles.additionalImportUrlsTA}
                  onChange={someSettingIsChanged}/>
      </div>
      <div>
        <h4>1回インポートSPARQL</h4>
        <textarea ref={sheetOneTimeImportSparqlTA}
                  defaultValue={currentSheet.oneTimeImportSparql}
                  className={styles.oneTimeImportSparqlTA}
                  onChange={someSettingIsChanged}/>
      </div>
      <div>
        <h4>反復インポートSPARQL</h4>
        <textarea ref={sheetIterationImportSparqlTA}
                  defaultValue={currentSheet.iterationImportSparql}
                  className={styles.iterationImportSparqlTA}
                  onChange={someSettingIsChanged}/>
      </div>
      <div className={styles.pathDiv}>
        <label htmlFor="rdfURLTB">RDF URL(エクスポートとの共通設定)</label>
        <input ref={sheetRdfURLTB} type="text" defaultValue={currentSheet.rdfPodUrl} onChange={someSettingIsChanged}/>
      </div>
      <MyDialog isVisible={isImportOpen} onClose={()=>setImportOpen(false)}>
        <ImportComponent settings={settings}
                         onImported={()=>setImportOpen(false)}/>
      </MyDialog>
    </div>
  );
};

export default Export;
