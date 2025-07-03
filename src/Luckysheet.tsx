import React, { useEffect, useRef } from 'react';

const Luckysheet: React.FC = () => {
  const hasRun = useRef(false); // [注1]一番下にコメント

  useEffect(() => {
    if (hasRun.current) return; // [注1]一番下にコメント
    hasRun.current = true; // [注1]一番下にコメント
    const luckysheet = (window as any).luckysheet;
    luckysheet.create({
      container: "luckysheet",
      //title: 'テスト', // showinfobar: falseの時は意味なし
      //lang: 'ja', // 日本語はまだ無理？zhだと中国語
      showinfobar: false, // 上のtitleとかが表示されるバー
      showtoolbar: true, // ツールバー
      sheetFormulaBar: true, // 式を入力するバー
      showsheetbar: true, // 下の方のシートを選ぶバー
      showstatisticBar: true, // 下の方の統計とか拡大縮小を表示するバー
      // plugins: ['chart'] // 2025,06/26現在、chartは動かないっぽい。
    });
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
