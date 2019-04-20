import React from 'react';
import { Image } from 'react-native';

export const iconNames = {
  HomeTabButton: 'home',
  PlayerTabButton: 'player-arrow',
  UpArrow: 'up-arrow',
  PlayMusic: 'play-music-button',
  PauseMusic: 'pause',
};

const IconGenerator = ({ iconName, size, onFocused = 1 }) => {
  const opacity = onFocused ? 1 : 0.4;

  let src = '';
  switch (iconName) {
    case iconNames.HomeTabButton:
      src = require('../../images/ic-home.png');
      break;
    case iconNames.PlayerTabButton:
      src = require('../../images/ic-player-arrow.png');
      break;
    case iconNames.UpArrow:
      src = require('../../images/ic-up-arrow.png');
      break;
    case iconNames.PlayMusic:
      src = require('../../images/ic-play-arrow.png');
      break;
    case iconNames.PauseMusic:
      src = require('../../images/ic-pause.png');
      break;
    default:
      console.log(`Error to get the image src of icon ${iconName.toString()}`);
      break;
  }

  return <Image style={{ height: size, width: size, opacity }} source={src} />;
};

export default IconGenerator;
