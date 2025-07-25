import React, { useState } from 'react';
import styles from './Menu.module.css';

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
    <div className={styles.menu_div}>
      <button className={styles.hamburger} onClick={() => setOpen(!open)}>{open?"×":"☰"}</button>
      <nav className={open ? styles.menu_open : styles.menu_close}>
        <ul>
          <li>画面切り替え
            <ul>
              <li onClick={() => {closeAndNotify('sheets');}}>Sheet</li>
              <li onClick={() => {closeAndNotify('settings');}}>Settings</li>
              <li onClick={() => {closeAndNotify('appSettings');}}>AppSettings</li>
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
