import React from 'react';

type Props = {
  isVisible: boolean;
  cName: string;
  children: React.ReactNode;
};

const ToggleDiv: React.FC<Props> = ({ isVisible, cName, children }) => {
  return (
    <div style={{ display: isVisible ? 'block' : 'none' }} className={cName}>
      {children}
    </div>
  );
};

export default ToggleDiv;
