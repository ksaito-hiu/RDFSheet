import React from 'react';

/*
 * 中身が重たいやつで、非表示だとしても消したくない要素。
 */

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
