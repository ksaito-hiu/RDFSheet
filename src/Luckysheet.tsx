import React, { useEffect, useRef } from 'react';
import { loadSheetsFromJSON, updateSettings, makeDummySettingsData } from './util';
import type { Settings } from './util';

type Props = {
  onLoad: (ss: Settings) => void;
};

type RDFS = {
  luckysheetfile: any;
  settings: Settings;
};

const Luckysheet: React.FC<Props> = ({ onLoad }) => {
  const hasRun = useRef(false); // [注1]一番下にコメント

  useEffect(() => {
    if (hasRun.current) return; // [注1]一番下にコメント
    hasRun.current = true; // [注1]一番下にコメント

    // とりあえず、localStorageにRDFSheetTempFileというキーがあって
    // そこにJSONデータがあれば、それを開くことにしておく。
    let rdfs: RDFS;
    try {
      const str = localStorage.getItem('RDFSheetTempFile');
      if (str) {
        rdfs = JSON.parse(str);
        localStorage.removeItem('RDFSheetTempFile');
      } else {
        rdfs = {luckysheetfile:undefined,settings:makeDummySettingsData()};
      }
    } catch(e) {
      rdfs = {luckysheetfile:undefined,settings:makeDummySettingsData()};
    }
    loadSheetsFromJSON(rdfs);
    updateSettings();
    onLoad(rdfs.settings);
  }, []);

  const luckyCss = {
    margin: '0px',
    padding: '0px',
    width: '100%',
    height: '100%',
  };
  return (
    <div id="luckysheet" style={luckyCss}>
    </div>
  );
}

export default Luckysheet

/*
 [注1]: <StrictMode>では内部の物がわざと2回マウント
        される。そのせいでLuckySheetが2回createされて
        変になるのを回避しないといけない。
 */
