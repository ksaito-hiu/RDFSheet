import { useState } from 'react';
import './App.css';
import LoginPane from './LoginPane';
import Menu from './Menu';
import Luckysheet from './Luckysheet';
import Settings from './Settings';

const App: React.FC = () => {
  const [activeContent, setActiveContent] = useState('sheets');

  return (
    <>
      <header>
        <Menu onSelect={(selected) => setActiveContent(selected)} />
        <LoginPane/>
      </header>
      <main>
        <div className="sheets" style={{ display: activeContent === 'sheets' ? 'block' : 'none' }}>
          <Luckysheet/>
        </div>
        <div className="settings" style={{ display: activeContent === 'settings' ? 'block' : 'none' }}>
          <Settings/>
        </div>
      </main>
    </>
  )
}

export default App
