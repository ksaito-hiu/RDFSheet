import { useState } from 'react';
import { webId } from './util';

const LoginPane: React.FC = () => {
  const [ id, setId ] = useState(webId);

  return (
    <>
      <p>WebID: {id} <button onClick={()=>{alert('loginout');setId('test');}}>login or logout</button></p>
    </>
  )
}

export default LoginPane;
