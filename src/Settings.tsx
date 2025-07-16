import React, { useState, useEffect } from 'react';
import MyDialog from './MyDialog';
import type { Setting } from './util';

/*
 * 設定画面のコンポーネント。デフォルトでLuckySheetのUIが
 * 先に表示済みで、このSettingsコンポーネットが表示される
 * タイミングでは設定のデータが読み込まれて準備が整っている
 * ことが前提になっている。また、このコンポーネントはApp.tsx
 * にてisSettingsActive===trueの時だけマウントされるのだが、
 * そのマウントのタイミングでLuckySheetのシートの追加・削除、
 * シート名変更などに対応する設定の更新をする。美しくない気が
 * するけど、今のところそんな仕組みだというのが重要。ただ、
 * その実装はutil.tsのupdateSettings関数に書くので、ここでは
 * それを呼ぶだけ。
 */

type Props = {
  settings: Setting[];
};

const Settings: React.FC<Props> = ({settings}) => {
  const [ isAppSettingsOpen, setAppSettingsOpen ] = useState(false);
  const [ sheetIdx, setSheetIdx ] = useState<string | number>(0);

  useEffect(() => {
    const selected: Setting | null = settings.reduce(
      (acc: Setting | null,cur) => acc!==null?acc:((cur.status==="1" || cur.status===1)?cur:acc),
      null
    );
    if (selected) setSheetIdx(selected.index);
console.log(`GAHA: ${JSON.stringify(settings,null,2)}`);
console.log(`GAHA: selected=${selected}`);
console.log(`GAHA: selected.index=${selected?.index}`);
  }, [settings]);

  return(
    <>
      <h3>Settings</h3><button onClick={()=>setAppSettingsOpen(true)}>アプリ設定</button>
      <ul>
        {settings.map((setting) => (
          <li>{setting.name}: {setting.index===sheetIdx}</li>
        ))}
      </ul>
      <p>{sheetIdx}:{settings.length}</p>
      <MyDialog isVisible={isAppSettingsOpen} onClose={()=>setAppSettingsOpen(false)}>
        <p>アプリ設定。未完！</p>
      </MyDialog>
    </>
  );
};

export default Settings;
