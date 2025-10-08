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
    style: {
      backgroundGradient: {
        colors: ['#FFA500', '#FF6B00'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards2.png' },
    style: {
      backgroundGradient: {
        colors: ['#8B5CF6', '#6D28D9'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards3.png' },
    style: {
      backgroundGradient: {
        colors: ['#FFD700', '#FFA500'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards4.png' },
    style: {
      backgroundGradient: {
        colors: ['#60A5FA', '#3B82F6'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards.png' },
    style: {
      backgroundGradient: {
        colors: ['#FFA500', '#FF6B00'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards2.png' },
    style: {
      backgroundGradient: {
        colors: ['#A78BFA', '#7C3AED'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards3.png' },
    style: {
      backgroundGradient: {
        colors: ['#38BDF8', '#0EA5E9'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards4.png' },
    style: {
      backgroundGradient: {
        colors: ['#FFA500', '#FF6B00'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards.png' },
    style: {
      backgroundGradient: {
        colors: ['#60A5FA', '#3B82F6'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards2.png' },
    style: {
      backgroundGradient: {
        colors: ['#FFA500', '#FF6B00'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards3.png' },
    style: {
      backgroundGradient: {
        colors: ['#A78BFA', '#7C3AED'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards4.png' },
    style: {
      backgroundGradient: {
        colors: ['#38BDF8', '#0EA5E9'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards.png' },
    style: {
      backgroundGradient: {
        colors: ['#60A5FA', '#3B82F6'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards2.png' },
    style: {
      backgroundGradient: {
        colors: ['#FFA500', '#FF6B00'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards3.png' },
    style: {
      backgroundGradient: {
        colors: ['#A78BFA', '#7C3AED'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
  },
  {
    image: { uri: '/rewards4.png' },
    style: {
      backgroundGradient: {
        colors: ['#38BDF8', '#0EA5E9'],
        type: 'linear' as const,
        direction: 'horizontal' as const,
      },
      textColor: '#fff',
    },
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
