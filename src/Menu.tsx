import React, { useState } from 'react';
import './Menu.css';

type Props = {
  onSelect: (selected: string) => void;
};

const Menu: React.FC<Props> = ({ onSelect }) => {
  const [ open, setOpen ] = useState(false);

  const closeAndNotify = (menuStr: string) => {
    setOpen(false);
    onSelect(menuStr);
  };

  return(
    <div className="menu_div">
      <button className="hamburger" onClick={() => setOpen(!open)}>{open?"×":"☰"}</button>
      <nav className={`menu ${open ? "open" : ""}`}>
        <ul>
          <li>画面切り替え
            <ul>
              <li onClick={() => {closeAndNotify('sheets');}}>Sheet</li>
              <li onClick={() => {closeAndNotify('settings');}}>Settings</li>
            </ul></li>
          <li>ファイル
            <ul>
              <li onClick={() => {closeAndNotify('load');}}>Load</li>
              <li onClick={() => {closeAndNotify('save');}}>Save</li>
              <li onClick={() => {closeAndNotify('import');}}>Import</li>
              <li onClick={() => {closeAndNotify('export');}}>Export</li>
            </ul></li>
          <li>その他
            <ul>
              <li onClick={() => {closeAndNotify('help');}}>Help</li>
              <li onClick={() => {closeAndNotify('about');}}>About</li>
            </ul></li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
