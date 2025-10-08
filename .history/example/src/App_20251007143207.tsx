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
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards2.png' },
    style: { backgroundColor: '#8B5CF6', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards3.png' },
    style: { backgroundColor: '#FFD700', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards4.png' },
    style: { backgroundColor: '#60A5FA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards1.png' },
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards2.png' },
    style: { backgroundColor: '#A78BFA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards3.png' },
    style: { backgroundColor: '#38BDF8', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards4.png' },
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards9.png' },
    style: { backgroundColor: '#60A5FA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards10.png' },
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards11.png' },
    style: { backgroundColor: '#A78BFA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards12.png' },
    style: { backgroundColor: '#38BDF8', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards13.png' },
    style: { backgroundColor: '#60A5FA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards14.png' },
    style: { backgroundColor: '#FFA500', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards15.png' },
    style: { backgroundColor: '#A78BFA', textColor: '#fff' },
  },
  {
    image: { uri: '/rewards16.png' },
    style: { backgroundColor: '#38BDF8', textColor: '#fff' },
  },
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
