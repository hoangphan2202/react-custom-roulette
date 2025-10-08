import React, { useState } from 'react';
import './App.css';

import { Wheel } from '../../src/index';

// const data = [
//   { option: 'REACT' },
//   { option: 'CUSTOM' },
//   { option: 'ROULETTE', style: { textColor: '#f9dd50' } },
//   { option: 'WHEEL' },
//   { option: 'REACT' },
//   { option: 'CUSTOM' },
//   { option: 'ROULETTE', style: { textColor: '#70bbe0' } },
//   { option: 'WHEEL' },
// ];

const rewards = [
  { option: '100K', style: { backgroundColor: '#FFA500', textColor: '#fff' } },
  { option: '3d', style: { backgroundColor: '#8B5CF6', textColor: '#fff' } },
  { option: '🎁', style: { backgroundColor: '#FFD700', textColor: '#fff' } },
  { option: '🎮', style: { backgroundColor: '#60A5FA', textColor: '#fff' } },
  { option: '😊', style: { backgroundColor: '#FFA500', textColor: '#fff' } },
  { option: '🎯', style: { backgroundColor: '#A78BFA', textColor: '#fff' } },
  { option: '💎', style: { backgroundColor: '#38BDF8', textColor: '#fff' } },
  { option: '⭐', style: { backgroundColor: '#FFA500', textColor: '#fff' } },
  { option: '🏆', style: { backgroundColor: '#60A5FA', textColor: '#fff' } },
  { option: '🎪', style: { backgroundColor: '#FFA500', textColor: '#fff' } },
  { option: '🎨', style: { backgroundColor: '#A78BFA', textColor: '#fff' } },
  { option: '20K', style: { backgroundColor: '#38BDF8', textColor: '#fff' } },
  { option: '🎭', style: { backgroundColor: '#60A5FA', textColor: '#fff' } },
  { option: '😢', style: { backgroundColor: '#FFA500', textColor: '#fff' } },
  { option: '🎸', style: { backgroundColor: '#A78BFA', textColor: '#fff' } },
  { option: '🌟', style: { backgroundColor: '#38BDF8', textColor: '#fff' } },
];

const backgroundColors = ['#ff8f43', '#70bbe0', '#0b3351', '#f9dd50'];
const textColors = ['#0b3351'];
const outerBorderColor = '#eeeeee';
const outerBorderWidth = 10;
const innerBorderColor = '#30261a';
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = '#eeeeee';
const radiusLineWidth = 8;
const fontFamily = 'Nunito';
const fontWeight = 'bold';
const fontSize = 20;
const fontStyle = 'normal';
const textDistance = 60;
const spinDuration = 1.0;

const App = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [reward, setReward] = useState('');

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * rewards.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={rewards}
          backgroundColors={backgroundColors}
          textColors={textColors}
          fontFamily={fontFamily}
          fontSize={fontSize}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          spinDuration={spinDuration}
          startingOptionIndex={2}
          // perpendicularText
          textDistance={textDistance}
          onStopSpinning={() => {
            setMustSpin(false);
          }}
        />
        <button className={'spin-button'} onClick={handleSpinClick}>
          SPIN
        </button>
      </header>
    </div>
  );
};

export default App;
