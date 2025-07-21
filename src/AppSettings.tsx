import React from 'react';
import { useAppData } from './AppDataContext';

type Props = {
  onChanged: () => void;
};

const AppSettings: React.FC<Props> = ({ onChanged }) => {
  const { appData, updateAppData } = useAppData();

  return(
    <>
      <h3>AppSettings</h3>
      <pre>{JSON.stringify(appData,null,2)}
      </pre>
      <button onClick={()=>{updateAppData({prefixes: {a:'b'}});onChanged()}}>change</button>
    </>
  );
};

export default AppSettings;
