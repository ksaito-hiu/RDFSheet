import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [ count, setCount ] = useState(0);

  return(
    <div>
      <h3>Settings</h3>
      <p onClick={()=>setCount(count+1)}>count={count}</p>
    </div>
  );
};

export default Settings;
