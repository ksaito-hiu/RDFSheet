import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [ count, setCount ] = useState(0);

  const settingCSS = {
    margin: '0px',
    padding: '0px',
    width: '100%',
    height: '100%',
  };

  return(
    <div style={settingCSS}>
      <h3>Settings</h3>
      <p onClick={()=>setCount(count+1)}>count={count}</p>
    </div>
  );
};

export default Settings;
