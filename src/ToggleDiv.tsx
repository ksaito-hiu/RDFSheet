import React, { useEffect } from 'react';

/*
 * 中身が重たいやつで、非表示だとしても消したくない要素。
 * 結局LuckySheetにした使ってないので、LuckySheetのための
 * リサイズ呼び出しとかもやらせる。
 */

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
};

const ToggleDiv: React.FC<Props> = ({ isVisible, children }) => {
  useEffect(() => {
    if (isVisible) {
      (window as any).luckysheet.resize();
    }
  }, [isVisible]);

  return (
    <div style={{ display: isVisible ? 'block' : 'none', width: '100vw', height: '100%' }}>
      {children}
    </div>
  );
};

export default ToggleDiv;
