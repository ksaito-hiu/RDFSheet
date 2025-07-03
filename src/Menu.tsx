import React, { useState } from 'react';
import { loadSheets, saveSheets, importRDF, exportRDF, openHelp, openAbout } from './util';
import './Menu.css';

type Props = {
  onSelect: (page: string) => void;
};

const Menu: React.FC<Props> = ({ onSelect }) => {
  const [ open, setOpen ] = useState(false);

  return(
    <div className="menu_div">
      <button className="hamburger" onClick={() => setOpen(!open)}>{open?"×":"☰"}</button>
      <nav className={`menu ${open ? "open" : ""}`}>
        <ul>
          <li>画面切り替え
            <ul>
              <li onClick={() => {setOpen(false);onSelect('sheets');}}>Sheet</li>
              <li onClick={() => {setOpen(false);onSelect('settings');}}>Settings</li>
            </ul></li>
          <li>ファイル
            <ul>
              <li onClick={() => {setOpen(false);loadSheets();}}>Load</li>
              <li onClick={() => {setOpen(false);saveSheets();}}>Save</li>
              <li onClick={() => {setOpen(false);importRDF();}}>Import</li>
              <li onClick={() => {setOpen(false);exportRDF();}}>Export</li>
            </ul></li>
          <li>その他
            <ul>
              <li onClick={() => {setOpen(false);openHelp();}}>Help</li>
              <li onClick={() => {setOpen(false);openAbout();}}>About</li>
            </ul></li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
