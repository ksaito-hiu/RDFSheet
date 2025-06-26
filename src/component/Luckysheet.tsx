import React from 'react';

class Luckysheet extends React.Component {
  componentDidMount() {
    const luckysheet = (window as any).luckysheet;
    luckysheet.create({
      container: "luckysheet",
      // plugins: ['chart'] // 2025,06/26現在、chartは動かないっぽい。
    });
  }

  render() {
    const luckyCss = {
      margin: '0px',
      padding: '0px',
      width: '100%',
      height: '100%',
    };
    return (
      <div id="luckysheet" style={luckyCss}>
      </div>
    );
  }
}

export default Luckysheet
