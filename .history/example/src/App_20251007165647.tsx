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
  {
    image: { uri: '/rewards.png' },
    style: { backgroundColor: 'linear-gradient(153deg, #FFA124 12.53%, #FFE48C 84.02%)', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards2.png' },
    style: { backgroundColor: '#8B5CF6', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards3.png' },
    style: { backgroundColor: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards4.png' },
    style: { backgroundColor: '#60A5FA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards.png' },
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards2.png' },
    style: { backgroundColor: 'linear-gradient(180deg, #A78BFA 0%, #8B5CF6 100%)', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards3.png' },
    style: { backgroundColor: '#38BDF8', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards4.png' },
    style: { backgroundColor: 'linear-gradient(90deg, #F59E0B 20%, #FCD34D 80%)', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards.png' },
    style: { backgroundColor: '#60A5FA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards2.png' },
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards3.png' },
    style: { backgroundColor: 'linear-gradient(45deg, #A78BFA 0%, #C4B5FD 100%)', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards4.png' },
    style: { backgroundColor: '#38BDF8', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards.png' },
    style: { backgroundColor: 'linear-gradient(225deg, #60A5FA 0%, #3B82F6 100%)', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards2.png' },
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards3.png' },
    style: { backgroundColor: '#A78BFA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards4.png' },
    style: { backgroundColor: 'linear-gradient(270deg, #38BDF8 0%, #0EA5E9 100%)', textColor: '#fff' },
  },
];

const textColors = ['#0b3351'];
const outerBorderColor = '#fff';
const outerBorderWidth = 2;
const innerBorderColor = '#000';
const innerBorderWidth = 10;
const innerRadius = 0;
const radiusLineColor = '#fff';
const radiusLineWidth = 2;
const fontFamily = 'Nunito';
const fontWeight = 'bold';
const fontSize = 20;
const fontStyle = 'normal';
const textDistance = 80;
const spinDuration = 1.0;

const App = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [reward, setReward] = useState('');

  console.log('reward');
  console.log(reward);

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
          // backgroundColors={backgroundColors}
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
          backgroundColors={rewards.map(r => r.style.backgroundColor)}
          // perpendicularText
          textDistance={textDistance}
          onStopSpinning={() => {
            setMustSpin(false);
            setReward(rewards[prizeNumber].option);
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
