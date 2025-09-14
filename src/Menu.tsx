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
          <li onClick={() => {closeAndNotify('help');}}>Help</li>
          <li onClick={() => {closeAndNotify('about');}}>About</li>
        </ul>
      </nav>
    </div>
  );
};

export default Menu;
