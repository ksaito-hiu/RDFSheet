import React, { useEffect, useRef } from 'react';
import { loadSheetsFromJSON } from './util';
import type { Setting } from './util';

type RDFS = {
  luckysheetfile: any;
  settings: Setting[];
};

const Luckysheet: React.FC = () => {
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
        rdfs = {luckysheetfile:undefined,settings:[]};
      }
    } catch(e) {
      rdfs = {luckysheetfile:undefined,settings:[]};
    }
    loadSheetsFromJSON(rdfs);
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
