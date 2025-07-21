//import { handleIncomingRedirect, login, logout, authFetch } from '@inrupt/solid-client-authn-browser';
const  { handleIncomingRedirect, login, logout, fetch } = (window as any).solidClientAuthentication;

//export const authFetch = fetch;

export const myLogin = async (idp: string) => {
  await login({
    oidcIssuer: idp
  });
};

export const myLogout = () => {
  logout();
};

export let isLoggedIn: boolean = false;
export let webId: string = 'not logged in';

export async function updateLoginStatus() {
  const info = await handleIncomingRedirect();
  if (info && info.isLoggedIn) {
    isLoggedIn = true;
    if (info.webId) webId = info.webId;
  } else {
    isLoggedIn = false;
    webId = 'not logged in';
  }
}

const luckysheet = (window as any).luckysheet;

/*
 * シートのタイプは「反復埋め込み」と「単純埋め込み」の2種類。
 */
export type SheetType = 'repetitive-embedding' | 'simple-embedding';

export type Setting = {
  index: string; // LuckySheetがnumber返してきたら文字列にする。本当はあぶない？
  name: string;
  status: number; // 実際には0か1。LuckySheetが"0"か"1"返した時には変換する
  sheetType: SheetType;
  repRange: string;
  prefixes: string;
  template: string;
  fileURL: string;
  rdfURL: string;
};

export const makeDummySetting: ()=>Setting = () => {
  return {
    index: 'iTha4zah', // 適当
    name: '??????????',
    status: 0,
    sheetType: 'repetitive-embedding',
    repRange: 'gaha1',
    prefixes: 'gaha2',
    template: 'gaha3:'+Math.random(),
    fileURL: 'gaha4',
    rdfURL: 'gaha5'
  };
}

export const settingsContainer: { settings: Setting[] } = {
  settings: []
};

// luckysheetを調べて設定データを更新する。
// luckysheetにシートの更新を検知する機能が無いので、
// Settingsコンポーネントが表示されるタイミングで、
// これが実行される。あと、ファイルなどから読み込んだ
// 時にも実行することにした。
export const updateSettings: ()=>Setting[] = () => {
  const sheets = (luckysheet.getAllSheets() as Setting[]);
  const oldSettings: Setting[] = settingsContainer.settings;
  const newSettings: Setting[] = [];
  sheets.forEach((sheet) => {
    const oldSetting: Setting | null = oldSettings.reduce(
      (acc: Setting | null,cur) => acc?acc:(cur.index===(sheet.index).toString()?cur:acc),
      null
    );
    if (oldSetting !== null) {
      oldSetting.name = sheet.name;
      oldSetting.status = Number(sheet.status);
      newSettings.push(oldSetting);
    } else {
      const s = makeDummySetting();
      s.index = (sheet.index).toString();
      s.name = sheet.name;
      s.status = Number(sheet.status);
      newSettings.push(s);
    }
  });
  settingsContainer.settings = newSettings;
  return newSettings;
};

type RDFS = {
  luckysheetfile: any;
  settings: any;
};

// JSONデータからRDFSheetファイルを開く
export function loadSheetsFromJSON(json: RDFS) {
  const options = {
    container: 'luckysheet',
    //title: 'テスト', // showinfobar: falseの時は意味なし
    //lang: 'ja', // 日本語はまだ無理？zhだと中国語
    data: undefined,
    showinfobar: false,
    showtoolbar: true, // ツールバー
    sheetFormulaBar: true, // 式を入力するバー
    showsheetbar: true, // 下の方のシートを選ぶバー
    showstatisticBar: true, // 下の方の統計とか拡大縮小を表示するバー
    // plugins: ['chart'], // 2025,06/26現在、chartは動かないっぽい。
  };
  if (json.luckysheetfile)
    options.data = json.luckysheetfile;
  if (json.settings)
    settingsContainer.settings = json.settings;
  luckysheet.create(options);
  updateSettings();
  //settingsContainer.settings = json.settings;
}

// ローカルのファイルからRDFSheetファイルを開く
export async function loadSheetsFromLocal(): Promise<void> {
  try {
    const opts = {
      types: [{
        description: 'RDFSheet file',
        accept: {'application/x-rdfsheet+json': ['.rdfs']},
      }],
    };
    const [handle] = await (window as any).showOpenFilePicker(opts);
    const file = await handle.getFile();
    const text = await file.text();
    const rdfs = (JSON.parse(text) as RDFS);
    loadSheetsFromJSON(rdfs);
  } catch(e) {
    alert('ファイルは開かれませんでした。');
  }
}

// PodからRDFSheetファイルを開く
export async function loadSheetsFromPod(podUrl: string): Promise<void> {
  try {
    const res = await fetch(podUrl);
    const json = await res.json();
    loadSheetsFromJSON(json);
  } catch(e) {
    alert(`ファイルの読み込みに失敗しました。`);
  }
}

// ローカルのファイルにRDFSheetファイルを保存
export async function saveSheetsToLocal(): Promise<void> {
  try {
    const rdfs: RDFS = {
      luckysheetfile: luckysheet.getluckysheetfile(),
      settings: JSON.parse(JSON.stringify(settingsContainer.settings))
    };
    const opts = {
      suggestedName: 'rdfsheetfile.rdfs',
      types: [{
        description: 'RDFSheet file',
        accept: {'application/x-rdfsheet+json': ['.rdfs']},
      }],
    };
    const handle = await (window as any).showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(rdfs));
    await writable.close();
  } catch(e) {
    alert('ファイルは保存されませんでした。');
  }
}

// PodにRDFSheetファイルを保存
export async function saveSheetsToPod(podUrl: string): Promise<void> {
  try {
    const rdfs: RDFS = {
      luckysheetfile: luckysheet.getluckysheetfile(),
      settings: JSON.parse(JSON.stringify(settingsContainer.settings))
    };
    await fetch(podUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-rdfsheet+json',
        body: JSON.stringify(rdfs)
      }
    });
  } catch(e) {
    alert(`ファイルの保存に失敗しました。`);
  }
}

// ローカルのファイルからRDFファイルの読み込み
export async function importRDFFromLocal(): Promise<void> {
  alert('importRDFFromLocal!');
}

// ローカルのファイルからRDFファイルの読み込み
export async function importRDFFromPod(podUrl: string): Promise<void> {
  alert(`importRDFFromPod! url=${podUrl}`);
}

// ローカルのファイルにRDFを書き出し
export async function exportRDFToLocal(): Promise<void> {
  alert('importRDF!');
}

// PodにRDFファイルをアップロード
export async function exportRDFToPod(podUrl: string): Promise<void> {
  alert(`exportRDFToPod! url=${podUrl}`);
}

// ヘルプをオープン
export function openHelp(): void {
  const url = 'https://github.com/ksaito-hiu/RDFSheet/tree/main/help';
  const opt = 'width=600,height=400,left=100,top=100,resizable=yes,scrollbars=yes';
  window.open(url,'help',opt);
}

// Aboutをオープン
export function openAbout(): void {
  const url = 'https://github.com/ksaito-hiu/RDFSheet/';
  const opt = 'width=600,height=400,left=100,top=100,resizable=yes,scrollbars=yes';
  window.open(url,'about',opt);
}
