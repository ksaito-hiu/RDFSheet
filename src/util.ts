//import { handleIncomingRedirect, login, logout } from '@inrupt/solid-client-authn-browser';
const  { handleIncomingRedirect, login, logout } = (window as any).solidClientAuthentication;

const localStorage = (window as any).localStorage;

const RDFSheetLocalStorageKey = 'RDFSheetLocalStorageKey';
const saveDefaultIdp = (idp: string) => {
  localStorage.setItem(RDFSheetLocalStorageKey,idp);
}
export const loadDefaultIdp = () => {
  const idp = localStorage.getItem(RDFSheetLocalStorageKey);
  return idp ? idp : 'https://solidcommunity.net';
}

export const myLogin = async (idp: string) => {
  saveDefaultIdp(idp); // ログイン前だけどこのタイミングしか・・・
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
let settings = {};

type RDFS = {
  luckysheetfile: any;
  settings: any;
};

// RDFSheetファイルを開く
export async function loadSheets(): Promise<void> {
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
    const rdfs = JSON.parse(text);
    const options = {
      container: 'luckysheet',
      data: rdfs.luckysheetfile,
      showinfobar: false,
    };
    luckysheet.create(options);
    settings = rdfs.settings;
  } catch(e) {
    alert('ファイルは開かれませんでした。');
  }
}

// RDFSheetファイルの保存
export async function saveSheets(): Promise<void> {
  try {
    const rdfs: RDFS = {
      luckysheetfile: luckysheet.getluckysheetfile(),
      settings: JSON.parse(JSON.stringify(settings))
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

// RDFファイルの読み込み
export async function importRDF(): Promise<void> {
  alert('importRDF!');
}

// RDFファイルの書き出し
export async function exportRDF(): Promise<void> {
  alert('exportRDF!');
}

// ヘルプをオープン
export function openHelp(): void {
  const url = 'https://github.com/ksaito-hiu/RDFSheet/help/';
  const opt = 'width=600,height=400,left=100,top=100,resizable=yes,scrollbars=yes';
  window.open(url,'help',opt);
}

// Aboutをオープン
export function openAbout(): void {
  const url = 'https://github.com/ksaito-hiu/RDFSheet/';
  const opt = 'width=600,height=400,left=100,top=100,resizable=yes,scrollbars=yes';
  window.open(url,'about',opt);
}
