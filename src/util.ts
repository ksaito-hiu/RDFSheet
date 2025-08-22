//import { handleIncomingRedirect, login, logout, authFetch } from '@inrupt/solid-client-authn-browser';
const  { handleIncomingRedirect, login, logout, fetch } = (window as any).solidClientAuthentication;

export const authFetch = fetch;

export const myLogin = async (idp: string) => {
  await login({
    oidcIssuer: idp
  });
};

export const myLogout = () => {
  logout();
};

export let isLoggedIn: boolean = false;
export let webId: string | null = null;

export async function updateLoginStatus() {
  const info = await handleIncomingRedirect();
  if (info && info.isLoggedIn) {
    isLoggedIn = true;
    if (info.webId) webId = info.webId;
  } else {
    isLoggedIn = false;
    webId = null;
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
  repRange: string;
  prefixes: string;
  oneTimeTemplate: string;
  iterationTemplate: string;
  rdfPodUrl: string;
};

export type Settings ={
  sheets: Setting[];
  fileSettings: { podUrl: string; };
}

export const settingsContainer: { settings: Settings } = {
  settings: {
    sheets: [],
    fileSettings: {
      podUrl: ''
    }
  }
};

export const makeDummySheetData: ()=>Setting = () => {
  return {
    index: 'iTha4zah', // 適当
    name: '??????????',
    status: 0,
    repRange: '',
    prefixes: '',
    oneTimeTemplate: '',
    iterationTemplate: '',
    rdfPodUrl: 'https://example.org/my_pod/rdfsheet.ttl'
  };
}

export const makeDummySettingsData: ()=>Settings = () => {
  return {
    sheets: [],
    fileSettings: { podUrl: 'https://example.org/my_pod/rdfsheet.rdfs' }
  };
}

// luckysheetを調べて設定データを更新する。
// luckysheetにシートの更新を検知する機能が無いので、
// Settingsコンポーネントが表示されるタイミングで、
// これが実行される。あと、ファイルなどから読み込んだ
// 時にも実行することにした。
export const updateSettings: ()=>Settings = () => {
  const nowSheets = (luckysheet.getAllSheets() as Setting[]);
  const oldSheets: Setting[] = settingsContainer.settings.sheets;
  const newSheets: Setting[] = [];
  nowSheets.forEach((nowSheet) => {
    const oldSheet: Setting | null = oldSheets.reduce(
      (acc: Setting | null,cur) => acc?acc:(cur.index===(nowSheet.index).toString()?cur:acc),
      null
    );
    if (oldSheet !== null) {
      oldSheet.name = nowSheet.name;
      oldSheet.status = Number(nowSheet.status);
      newSheets.push(oldSheet);
    } else {
      const s = makeDummySheetData();
      s.index = (nowSheet.index).toString();
      s.name = nowSheet.name;
      s.status = Number(nowSheet.status);
      newSheets.push(s);
    }
  });
  settingsContainer.settings.sheets = newSheets;
  return settingsContainer.settings;
};

type RDFS = {
  luckysheetfile: any;
  settings: any;
};

// 型のわからない例外から文字列のエラーメッセージを生成
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

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
    alert(`ファイルは開かれませんでした。${getErrorMessage(e)}`);
  }
}

// PodからRDFSheetファイルを開く
export async function loadSheetsFromPod(podUrl: string): Promise<void> {
  try {
    const res = await fetch(podUrl);
    const json = await res.json();
    loadSheetsFromJSON(json);
  } catch(e) {
    alert(`ファイルの読み込みに失敗しました。${getErrorMessage(e)}`);
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
    alert(`ファイルは保存されませんでした。${getErrorMessage(e)}`);
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
        'Content-Type': 'application/x-rdfsheet+json'
      },
      body: JSON.stringify(rdfs)
    });
    alert('ファイルを保存しました。');
  } catch(e) {
    alert(`ファイルの保存に失敗しました。${getErrorMessage(e)}`);
  }
}

function importRDFFromStr(str: string) {
console.log(`GAHA: ${str}`);
  alert('importRDFFromStr. not implemented yet!');
}

// ローカルのファイルからRDFファイルの読み込み
export async function importRDFFromLocal(): Promise<void> {
  updateSettings();
  try {
    const opts = {
      types: [{
        description: 'Turtle(RDF) file',
        accept: {'text/turtle': ['.ttl']},
      }],
    };
    const [handle] = await (window as any).showOpenFilePicker(opts);
    const file = await handle.getFile();
    const text = await file.text();
    importRDFFromStr(text);
  } catch(e) {
    alert(`ファイルは開かれませんでした。${getErrorMessage(e)}`);
  }
}

// ローカルのファイルからRDFファイルの読み込み
export async function importRDFFromPod(podUrl: string): Promise<void> {
  updateSettings();
  try {
    const res = await fetch(podUrl);
    const text = await res.text();
    importRDFFromStr(text);
  } catch(e) {
    alert(`ファイルの読み込みに失敗しました。${getErrorMessage(e)}`);
  }
}

function exportRDFToStr() {
  const sheetSoeji: number = settingsContainer.settings.sheets.reduce(
    (acc: number, cur: Setting, soeji) => acc!=-1?acc:((cur.status===1)?soeji:acc),
    -1
  );
  const sheet = settingsContainer.settings.sheets[sheetSoeji];
  if (sheet) {
    console.log(`name: ${sheet.name}`);
    console.log(`repRange: ${sheet.repRange}`);
    console.log(`prefixes: ${sheet.prefixes}`);
    console.log(`oneTimeTemplate: ${sheet.oneTimeTemplate}`);
    console.log(`iterationTemplate: ${sheet.iterationTemplate}`);
    console.log(`rdfPodUrl: ${sheet.rdfPodUrl}`);
    if (sheet.repRange!=='') { // 反復埋め込みが必要
      const startCell = sheet.repRange.split(':')[0];
      const endCell = sheet.repRange.split(':')[1];
      const start = cellStrToColRow(startCell);
      const end = cellStrToColRow(endCell);
      console.log(`start=${JSON.stringify(start)}`);
      console.log(`end=${JSON.stringify(end)}`);
      const setting = {
        type: 'v', // 'v'と'm'が可能
        order: sheetSoeji, // worksheetのorder？？？
      };
      for (let row=start.row; row<=end.row; row++) {
        for (let col=start.col; col<=end.col; col++) {
          const v = luckysheet.getCellValue(row,col,setting);
          console.log(`row=${row}, col=${col}, v=${v}`);
        }
      }
    }
    return '<#a> <#b> "ok" .';
  } else {
    alert('アクティブなシートがありません？！');
    return null;
  }
}

// ローカルのファイルにRDF(Turtle)を書き出し
export async function exportRDFToLocal(): Promise<void> {
  updateSettings();
  const str = exportRDFToStr();
  console.log(str);
  try {
    const opts = {
      suggestedName: 'rdfsheetfile.ttl',
      types: [{
        description: 'Turtle(RDF) file',
        accept: {'text/turtle': ['.ttl']},
      }],
    };
    const handle = await (window as any).showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(str);
    await writable.close();
  } catch(e) {
    alert(`RDFファイルは保存されませんでした。${getErrorMessage(e)}`);
  }
}

// PodにRDFファイルをアップロード
export async function exportRDFToPod(podUrl: string): Promise<void> {
  updateSettings();
  const str = exportRDFToStr();
  console.log(str);
  try {
    await fetch(podUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'
      },
      body: str
    });
    alert('RDFをエクスポートしました。');
  } catch(e) {
    alert(`RDFのエクスポートに失敗しました。${getErrorMessage(e)}`);
  }
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

// カラム数をアルファベット文字列に変換
export const columnNumToAlphabet = (idx: number) => {
  let ret: string = '';
  let tmp = idx;
  do {
    const remainder = tmp % 25;
    tmp = Math.floor(tmp / 25);
    ret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(remainder) + ret;
  } while (tmp > 0);
  return ret;
};

// アルファベット文字列をカラム数に変換
export const alphabetToColumnNum = (str: string) => {
  const strL = str.toUpperCase();
  let num: number = 0;
  for (let i=(strL.length-1);i>=0;i--) {
    num *= 25;
    num += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(strL.charAt(i));
  }
  return num;
};

// セルを表す文字列から列と行を計算する
export const cellStrToColRow: (cell: string)=>{col: number; row: number} = (cell: string) => {
  const match = cell.match(/^([A-Z]+)(\d+)$/i);
  if (!match)
    throw new Error("無効なセル式です。");

  const [, col, row] = match;
  const colNum = alphabetToColumnNum(col);
  const rowNum = Number(row)-1;
  return { col: colNum, row: rowNum };
};

// アクティブなシートの選択されている範囲を返す。
// 範囲だけでなく、どのシートがアクティブかも返す。
// なので、返り値の型は{ range: string, sheetIdx: string }。
// マウスでの選択は複数可能なんだけど、最初に選択された
// 範囲を返すことにする。
export const getSelectedRange = () => {
  const rs = luckysheet.getRangeAxis();
  const ss = luckysheet.getAllSheets();
  let idx;
  for (const s of ss) {
    if (Number(s.status) === 1) {
      idx = (s.index).toString();
    }
  }
  
  return {
    range: rs[0],
    sheetIdx: idx
  };
};

export const evalFuncs: (f: {in:string; out:string;}[][], fNum: number, input: string) => string | null = (f,fNum,input) => {
  return f[fNum].reduce(
    (acc: string | null, cur) => acc?acc:(cur.in===input)?cur.out:acc,
    null
  );
};
