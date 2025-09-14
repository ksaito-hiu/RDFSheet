import { useState } from 'react';
import { openHelp, openAbout, updateSettings, settingsContainer } from './util';
import type { Settings } from './util';
import styles from './App.module.css';
import { AppDataProvider } from './AppDataContext';
import LoginPane from './LoginPane';
import Menu from './Menu';
import ToggleDiv from './ToggleDiv';
import MyDialog from './MyDialog';
import Luckysheet from './Luckysheet';
import Export from './Export';
import Import from './Import';
import BookSettings from './BookSettings';
import AppSettings from './AppSettings';
import LoadComponent from './LoadComponent';
import SaveComponent from './SaveComponent';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(settingsContainer.settings);
  const [isSheetsActive, setSheetsActive] = useState(true);
  const [isExportActive, setExportActive] = useState(false);
  const [isImportActive, setImportActive] = useState(false);
  const [isBookSettingsActive, setBookSettingsActive] = useState(false);
  const [isAppSettingsActive, setAppSettingsActive] = useState(false);
  const [isLoadOpen, setLoadOpen] = useState(false);
  const [isSaveOpen, setSaveOpen] = useState(false);

  const changeListener = (selected: string) => {
    if (['export','import'].includes(selected))
      setSettings(updateSettings());

    if (!(['load','save','help','about'].includes(selected))) {
      setSheetsActive(selected==='sheets');
      setExportActive(selected==='export');
      setImportActive(selected==='import');
      setBookSettingsActive(selected==='bookSettings');
      setAppSettingsActive(selected==='appSettings');
    }

    if (selected === 'load') setLoadOpen(true);
    else if (selected === 'save') setSaveOpen(true);
    else if (selected === 'help') openHelp();
    else if (selected === 'about') openAbout();
  };

  return (
    <AppDataProvider>
      <header>
        <Menu onSelect={changeListener} />
        <div className={styles.headerPanels}>
          <LoginPane/>
          <div>
            <button onClick={()=>changeListener('sheets')}
                    style={{background: isSheetsActive?'red':'white'}}>Sheets</button>
            <button onClick={()=>changeListener('load')}
                    style={{background: 'white'}}>Load</button>
            <button onClick={()=>changeListener('save')}
                    style={{background: 'white'}}>Save</button>
            <button onClick={()=>changeListener('export')}
                    style={{background: isExportActive?'red':'white'}}>Export</button>
            <button onClick={()=>changeListener('import')}
                    style={{background: isImportActive?'red':'white'}}>Import</button>
            <button onClick={()=>changeListener('bookSettings')}
                    style={{background: isBookSettingsActive?'red':'white'}}>BookSettings</button>
            <button onClick={()=>changeListener('appSettings')}
                    style={{background: isAppSettingsActive?'red':'white'}}>AppSettings</button>
          </div>
        </div>
      </header>
      <main>
        <ToggleDiv isVisible={isSheetsActive}>
          <Luckysheet onLoad={(ss)=>setSettings(ss)}/>
        </ToggleDiv>
        { isExportActive === true ? (
          <Export settings={settings} onChange={(ss)=>setSettings(ss)}/>
        ) : null }
        { isImportActive === true ? (
          <Import settings={settings} onChange={(ss)=>setSettings(ss)}/>
        ) : null }
        { isBookSettingsActive === true ? (
          <BookSettings settings={settings} onChange={(ss)=>setSettings(ss)}/>
        ) : null }
        { isAppSettingsActive === true ? (
          <AppSettings/>
        ) : null }
      </main>
      <MyDialog isVisible={isLoadOpen} onClose={()=>setLoadOpen(false)}>
        <LoadComponent settings={settings}
                       onLoaded={()=>{setLoadOpen(false);setSettings(settingsContainer.settings);}}/>
      </MyDialog>
      <MyDialog isVisible={isSaveOpen} onClose={()=>setSaveOpen(false)}>
        <SaveComponent settings={settings}
                       onSaved={()=>setSaveOpen(false)}/>
      </MyDialog>
    </AppDataProvider>
  )
}

export default App
