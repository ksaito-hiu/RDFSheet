import React, { useEffect, useRef } from 'react';
import { loadSheetsFromJSON } from './util';

type RDFS = {
  luckysheetfile: any;
  settings: any;
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
console.log("GAHA: JSON.parse start");
        rdfs = JSON.parse(str);
console.log("GAHA: JSON.parse end");
        localStorage.removeItem('RDFSheetTempFile');
console.log("GAHA: removeItem end");
      } else {
        rdfs = {luckysheetfile:undefined,settings:{}};
      }
    } catch(e) {
      rdfs = {luckysheetfile:undefined,settings:{}};
    }
console.log("GAHA: loadSheetsFromJSON start");
    loadSheetsFromJSON(rdfs);
console.log("GAHA: loadSheetsFromJSON end");
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
