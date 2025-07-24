import { useState } from 'react';
import { openHelp, openAbout, updateSettings, settingsContainer } from './util';
import type { Setting } from './util';
import './App.css';
import { AppDataProvider } from './AppDataContext';
import LoginPane from './LoginPane';
import Menu from './Menu';
import ToggleDiv from './ToggleDiv';
import MyDialog from './MyDialog';
import Luckysheet from './Luckysheet';
import Settings from './Settings';
import LoadComponent from './LoadComponent';
import SaveComponent from './SaveComponent';
import ImportComponent from './ImportComponent';
import ExportComponent from './ExportComponent';

const App: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isSheetsActive, setSheetsActive] = useState(true);
  const [isSettingsActive, setSettingsActive] = useState(false);
  const [isLoadOpen, setLoadOpen] = useState(false);
  const [isSaveOpen, setSaveOpen] = useState(false);
  const [isImportOpen, setImportOpen] = useState(false);
  const [isExportOpen, setExportOpen] = useState(false);

  const selectedListener = (selected: string) => {
    if (selected === 'sheets') {
      setSheetsActive(true);
      setSettingsActive(false);
    } else if (selected === 'settings') {
      setSettings(updateSettings());
      setSheetsActive(false);
      setSettingsActive(true);
    } else if (selected === 'load') {
      setLoadOpen(true);
    } else if (selected === 'save') {
      setSaveOpen(true);
    } else if (selected === 'import') {
      setImportOpen(true);
    } else if (selected === 'export') {
      setExportOpen(true);
    } else if (selected === 'help') {
      openHelp();
    } else if (selected === 'about') {
      openAbout();
    } else {
      console.log('GAHA: ????????');
    }
  };

  return (
    <AppDataProvider>
      <header>
        <Menu onSelect={selectedListener} />
        <LoginPane/>
      </header>
      <main>
        <ToggleDiv isVisible={isSheetsActive}>
          <Luckysheet onLoad={(ss)=>setSettings(ss)}/>
        </ToggleDiv>
        { isSettingsActive === true ? (
          <Settings settings={settings} onChange={(ss)=>setSettings(ss)}/>
        ) : null }
      </main>
      <MyDialog isVisible={isLoadOpen} onClose={()=>setLoadOpen(false)}>
        <LoadComponent onLoaded={()=>{setLoadOpen(false);setSettings(settingsContainer.settings);}}/>
      </MyDialog>
      <MyDialog isVisible={isSaveOpen} onClose={()=>setSaveOpen(false)}>
        <SaveComponent onSaved={()=>setSaveOpen(false)}/>
      </MyDialog>
      <MyDialog isVisible={isImportOpen} onClose={()=>setImportOpen(false)}>
        <ImportComponent onImported={()=>setImportOpen(false)}/>
      </MyDialog>
      <MyDialog isVisible={isExportOpen} onClose={()=>setExportOpen(false)}>
        <ExportComponent onExported={()=>setExportOpen(false)}/>
      </MyDialog>
    </AppDataProvider>
  )
}

export default App
