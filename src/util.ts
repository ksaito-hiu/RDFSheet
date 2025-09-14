//import { handleIncomingRedirect, login, logout, authFetch } from '@inrupt/solid-client-authn-browser';
const  { handleIncomingRedirect, login, logout, fetch } = (window as any).solidClientAuthentication;
import { defaultAppData } from './AppDataContext';
import { QueryEngine } from '@comunica/query-sparql'; // 下で動的インポートにしたらエラーになった？
import type { SourceType } from '@comunica/types';
import * as N3 from 'n3';

const RDFSheetLocalStorageKey = 'RDFSheetLocalStorageKey';
const localStorage = (window as any).localStorage;

export const authFetch = fetch;

/*
 * N3のストアに対してturtle形式で記述されたRDFデータを追加します。
 * @param {string} turtle 文字列でTurtle記法のRDF
 * @param {N3.Store} store N3.jsライブラリのストア
 * @param {string} base Turtleを解釈する時のベースURL
 * @return {Object.<string, string>} プレフィックス
 */
async function appendTurtleToStore(turtle: string, store: N3.Store, base: string) {
  return new Promise((resolve, reject) => {
    const opt = { format: 'text/turtle', baseIRI: base };
    const parser = new N3.Parser(opt);
    parser.parse(turtle, (error, quad, prefixes) => {
      if (error)
        reject(error);
      else if (quad)
        store.addQuad(quad);
      else
        resolve(prefixes);
    });
  });
}

function getAppData() {
  const saved = localStorage.getItem(RDFSheetLocalStorageKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return { ...defaultAppData, ...parsed };
      }
    } catch(e) {
      
    }
  } else {
    return {"prefixes":"@prefix dc: <http://purl.org/dc/terms/> .","idp":"https://solidweb.me","":""};
  }
}

export const myLogin = async (idp: string) => {
  const appData = getAppData();
  let client = null;
  for (const c of appData.clientIDs) {
    if (idp.indexOf(c.provider) >= 0) {
      client = c;
      break;
    }
  }
  const opt: any = { oidcIssuer: idp };
  if (client) {
    opt.clientId = atob(client.id);
    opt.clientSecret = atob(client.secret);
  }
  await login(opt);
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
  additionalImportUrls: string;
  oneTimeImportSparql: string;
  iterationImportSparql: string;
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
    additionalImportUrls: '',
    oneTimeImportSparql: '',
    iterationImportSparql: '',
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
    const res = await authFetch(podUrl);
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
    await authFetch(podUrl, {
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

async function importRDFFromStr(str: string, base: string) {
  // PWAで動的インポートにしたらエラーになった？
  //const { QueryEngine } = await import('@comunica/query-sparql');

  const sheetSoeji: number = settingsContainer.settings.sheets.reduce(
    (acc: number, cur: Setting, soeji) => acc!=-1?acc:((cur.status===1)?soeji:acc),
    -1
  );
  const sheet = settingsContainer.settings.sheets[sheetSoeji];
  if (sheet) {
    try {
      const engine = new QueryEngine();
      const store = new N3.Store();
      await appendTurtleToStore(str, store, base);
      const sources: [SourceType] = [store];
      for (const l of sheet.additionalImportUrls.split('\n')) {
        if (l !== '') sources.push(l);
      }
      const oneTimeSparql = `BASE <${base}>\n`+sheet.oneTimeImportSparql;
      const bindingsStream = await engine.queryBindings(oneTimeSparql,{sources});
      const bindings = await bindingsStream.toArray(); // 面倒なんで同期で
      const setting = {isRefresh:true}; // luckysheetで書き込む時の設定。
      // oneTimeなので[0]だけ使う
      if (bindings.length >= 1) {
        for (const [key,value] of bindings[0]) {
          console.log(`GAHA: ${key.value}<=${value.value}`);
          const c = cellStrToColRow(key.value);
          luckysheet.setCellValue(c.row,c.col,value.value,setting);
        }
      } else {
        alert('The result of oneTimeSparql is empty.');
      }
      // 反復埋め込みが必要な場合の処理
      if (sheet.repRange!=='') {
        const startCell = sheet.repRange.split(':')[0];
        const endCell = sheet.repRange.split(':')[1];
        const start = cellStrToColRow(startCell);
        const end = cellStrToColRow(endCell);

        const iterationImportSparql = `BASE <${base}>\n`+sheet.iterationImportSparql;
        //const bindingsStream2 = await engine.queryBindings(iterationImportSparql,{sources});
        const result = await engine.query(iterationImportSparql,{sources});
        if (result.resultType !== 'bindings')
          throw new Error('iterationImportSparql is not SELECT query.');
        const metadata = await result.metadata();
        const bindingsStream2 = await result.execute();
        const bindings2 = await bindingsStream2.toArray(); // 面倒なんで同期で
        alert(`The result count of iterationImportSparql is ${bindings2.length}.`);

        let variables = metadata.variables;
        for (let row=start.row+1; row<=end.row+1; row++) { // rowは1から数える方針
          const binding = bindings2.shift();
          if (binding != null) {
            for (const [key,value] of binding) {
              const c = cellStrToColRow(`${key.value}${row}`);
              luckysheet.setCellValue(c.row,c.col,value.value,setting);
            }
          } else {
            for (const col of variables) {
              const c = cellStrToColRow(`${col.value}${row}`);
              luckysheet.setCellValue(c.row,c.col,'',setting);
            }
          }
        }
      }
      luckysheet.refreshFormula();
    } catch(e) {
      throw new Error(`インポートエラー`);
    }
  } else {
    alert('アクティブなシートがありません？！');
    return null;
  }
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
    const base = `file:///C:/Users/me/RDFSheet/${file.name}`; // どうしてもPATHは得られないので。
    await importRDFFromStr(text,base);
  } catch(e) {
    alert(`ファイルは開かれませんでした。${getErrorMessage(e)}`);
  }
}

// ローカルのファイルからRDFファイルの読み込み
export async function importRDFFromPod(podUrl: string): Promise<void> {
  updateSettings();
  try {
    const res = await authFetch(podUrl);
    const text = await res.text();
    await importRDFFromStr(text,podUrl);
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
    //luckysheet.recalc(); // =NOW()などの関数がこの瞬間に更新されるように。
    const setting = {
      type: 'v', // 'v'と'm'が可能
      order: sheetSoeji, // worksheetのorder？？？
    };
    // プレフィックス追加
    let result = '';
    result += sheet.prefixes;
    // 一回テンプレートの処理
    let phs0 = sheet.oneTimeTemplate.matchAll(/<<([A-Za-z]+)(\d+)>>/g);
    let phs1 = [...phs0].map(m => `${m[1]}${m[2]}`);
    let map: any = {};
    for (const ph of phs1) {
      const rc = cellStrToColRow(ph);
      map[ph] = luckysheet.getCellValue(rc.row,rc.col,setting);
    }
    let tmp = sheet.oneTimeTemplate;
    for (const ph of Object.keys(map)) {
      tmp = tmp.replace(`<<${ph}>>`,map[ph]);
    }
    result += tmp;
    // 反復埋め込みが必要な場合の処理
    if (sheet.repRange!=='') {
      // まずは繰り返しで変らない埋め込みの処理
      phs0 = sheet.oneTimeTemplate.matchAll(/<<([A-Za-z]+)(\d+)>>/g);
      phs1 = [...phs0].map(m => `${m[1]}${m[2]}`);
      map = {};
      for (const ph of phs1) {
        const rc = cellStrToColRow(ph);
        map[ph] = luckysheet.getCellValue(rc.row,rc.col,setting);
      }
      tmp = sheet.iterationTemplate;
      for (const ph of Object.keys(map)) {
        tmp = tmp.replace(`<<${ph}>>`,map[ph]);
      }
      // 繰り返しで変化する埋め込みの処理
      phs0 = sheet.iterationTemplate.matchAll(/<<([A-Za-z]+)>>/g);
      phs1 = [...phs0].map(m => m[1]);
      const startCell = sheet.repRange.split(':')[0];
      const endCell = sheet.repRange.split(':')[1];
      const start = cellStrToColRow(startCell);
      const end = cellStrToColRow(endCell);
      let skippedCount = 0;
      outer: for (let row=start.row; row<=end.row; row++) {
        let tmp2 = tmp;
        map = {};
        for (const ph of phs1) {
          const col = alphabetToColumnNum(ph);
          map[ph] = luckysheet.getCellValue(row,col,setting);
          if (map[ph] == null) {
            map = {};
            skippedCount++;
            continue outer;
          }
        }
        for (const ph of Object.keys(map)) {
          tmp2 = tmp2.replace(`<<${ph}>>`,map[ph]);
        }
        result += tmp2;
      }
      if (skippedCount!==0) {
        alert(`繰り返し処理中に必要なデータが無かったためにとばした行が${skippedCount}行ありました。`);
      }
    }
    return result;
  } else {
    alert('アクティブなシートがありません？！');
    return null;
  }
}

// ローカルのファイルにRDF(Turtle)を書き出し
export async function exportRDFToLocal(): Promise<void> {
  updateSettings();
  const str = exportRDFToStr();
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
  try {
    await authFetch(podUrl, {
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
  const match = cell.match(/^([A-Za-z]+)(\d+)$/i);
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
