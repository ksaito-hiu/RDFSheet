import { useState } from 'react';
import { loadSheets, saveSheets, importRDF, exportRDF, openHelp, openAbout } from './util';
import './App.css';
import LoginPane from './LoginPane';
import Menu from './Menu';
import ToggleDiv from './ToggleDiv';
import MyDialog from './MyDialog';
import Luckysheet from './Luckysheet';
import Settings from './Settings';

const App: React.FC = () => {
  const [isSheetsActive, setSheetsActive] = useState(true);
  const [isSettingsActive, setSettingsActive] = useState(false);
  const [isImportOpen, setImportOpen] = useState(false);
  const [isExportOpen, setExportOpen] = useState(false);

  const selectedListener = (selected: string) => {
    if (selected === 'sheets') {
      setSheetsActive(true);
      setSettingsActive(false);
    } else if (selected === 'settings') {
      setSheetsActive(false);
      setSettingsActive(true);
    } else if (selected === 'load') {
      loadSheets();
    } else if (selected === 'save') {
      saveSheets();
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

  const processImport = () => {
    importRDF();
    setImportOpen(false); // MyDialog消すため
  };

  const processExport = () => {
    exportRDF();
    setExportOpen(false); // MyDialog消すため
  };

  return (
    <>
      <header>
        <Menu onSelect={selectedListener} />
        <LoginPane/>
      </header>
      <main>
        <ToggleDiv isVisible={isSheetsActive} cName="sheets">
          <Luckysheet/>
        </ToggleDiv>
        <ToggleDiv isVisible={isSettingsActive} cName="settings">
          <Settings/>
        </ToggleDiv>
      </main>
      <MyDialog isVisible={isImportOpen} onClose={()=>setImportOpen(false)}>
        <p>ImportDialog</p>
        <button type="button" onClick={processImport}>import</button>
      </MyDialog>
      <MyDialog isVisible={isExportOpen} onClose={()=>setExportOpen(false)}>
        <p>ExportDialog</p>
        <button type="button" onClick={processExport}>export</button>
      </MyDialog>
    </>
  )
}

export default App
