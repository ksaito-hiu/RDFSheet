import { useState } from 'react';
import './App.css';
import Luckysheet from './component/Luckysheet';

type Tab = {
  id: string;
  label: string;
};

const tabs: Tab[] = [
  { id: 'sheets', label: 'Sheets' },
  { id: 'settings', label: 'Settings' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sheets');

  const changeTab: (id: string) => void = (id) => {
    const mySheets = document.querySelector('#mySheets');
    const mySettings = document.querySelector('#mySettings');
    switch (id) {
      case "sheets":
        if (mySheets !== null && mySheets instanceof HTMLDivElement)
          mySheets.style.display = 'block';
        if (mySettings !== null && mySettings instanceof HTMLDivElement)
          mySettings.style.display = 'none';
        break;
      case "settings":
        if (mySheets !== null && mySheets instanceof HTMLDivElement)
          mySheets.style.display = 'none';
        if (mySettings !== null && mySettings instanceof HTMLDivElement)
          mySettings.style.display = 'block';
        break;
    }
  };

  return (
    <>
      {/* タブ部分 */}
      <div id='myTabs'>
        {tabs.map((tab) => (
          <button
             key={tab.id}
             onClick={() => {setActiveTab(tab.id);changeTab(tab.id)}}
             style={{
               borderBottom: activeTab === tab.id ? '2px solid blue' : 'none',
               fontWeight: activeTab === tab.id ? 'bold' : 'normal',
             }}
          >
            {tab.label}
          </button>
        ))}
        <div className="growBox"></div>
        <div>RDFSheet</div>
      </div>

      {/* コンテンツ部分 */}
      <div id="myContent">
        <div id="mySheets">
          <Luckysheet/>
        </div>
        <div id="mySettings">
          mySettings
        </div>
      </div>
    </>
  )
}

export default App
