import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import TextTicker from 'react-native-text-ticker';
import IconGenerator, { iconNames } from '../icon-generator/IconGenerator';

const MiniPlayer = ({
  songName,
  artist,
  onPressedUpArrow,
  onPressedPlay,
  onPressedText,
  paused,
  currentTime,
  duration,
}) => {
  const textLength = songName.length + artist.length;
  const speedPerChar = 145;
  const toggleIconPlayer = paused ? iconNames.PlayMusic : iconNames.PauseMusic;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.05, backgroundColor: 'red' }}>
        <TinyProgressBar currentTime={currentTime} duration={duration} />
      </View>
      <View style={styles.controlContainer}>
        <TouchableOpacity onPress={onPressedUpArrow}>
          <IconGenerator iconName={iconNames.UpArrow} size={16} />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressedText}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: width * 0.7,
              flexWrap: 'nowrap',
              paddingHorizontal: 20,
            }}
          >
            {/* 
        NOTE:
          TextTicker Componenet seems like cracked when we use multiple Text components
          as content value.
          Actual behavior: Content scrolls too fast.
        */}
            <TextTicker
              style={styles.songText}
              duration={textLength * speedPerChar}
              animationType="scroll"
              loop
              repeatSpacer={100}
              marqueeDelay={500}
            >
              {songName} <ArtistTextStyle> • {artist} </ArtistTextStyle>
            </TextTicker>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onPressedPlay}>
          <IconGenerator iconName={toggleIconPlayer} size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ArtistTextStyle = ({ children }) => <Text style={styles.artistText}>{children}</Text>;
const TinyProgressBar = ({ duration, currentTime }) => {
  const progressPercent = currentTime / duration;
  return (
    <View style={{ flex: 1, flexDirection: 'row', width: '100%' }}>
      <View style={{ flex: progressPercent, backgroundColor: 'white' }} />
      <View style={{ flex: 1 - progressPercent, backgroundColor: 'rgb(57, 57, 60)' }} />
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  controlContainer: {
    flex: 0.95,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgb(34,35,38)',
    marginBottom: 2,
    paddingRight: 10,
    paddingLeft: 20,
  },
  songText: {
    fontWeight: 'bold',
    color: 'white',
  },
  artistText: {
    color: '#b3b3b3',
  },
});

export default MiniPlayer;
