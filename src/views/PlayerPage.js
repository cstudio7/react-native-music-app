import React, { Component } from 'react';
import { View, StatusBar, Alert, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { connect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/header/Header';
import AlbumArt from '../components/album/AlbumArt';
import TrackDetails from '../components/track-details/TrackDetails';
import SeekBar from '../components/seek-bar/SeekBar';
import Controls from '../components/controls/Controls';
import Playlist from '../components/playlist/Playlist';

class PlayerPage extends Component {
  constructor(props) {
    super(props);
    const { playlist } = this.props;

    this.state = {
      paused: false,
      duration: 1,
      currentPosition: 0,
      selectedTrack: 0,
      repeatOn: false,
      shuffleOn: false,
      isChanging: false,
      showPlaylist: false,
      playlist,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.playlist !== prevState.playlist) {
      console.log(nextProps.playlist);
      console.log(prevState.playlist);
      return {
        ...nextProps,
        selectedTrack: 0,
      };
    }

    return null;
  }

  setDuration = data => {
    this.setState({
      duration: Math.floor(data.duration),
    });
  };

  setCurrentPosition = data => {
    this.setState({
      currentPosition: Math.floor(data.currentTime),
    });
  };

  onSliding = time => {
    const ttime = Math.round(time);
    this.videoPlayer.seek(ttime);
    this.setState({
      currentPosition: ttime,
      paused: true,
    });
  };

  videoError = () => {
    Alert.alert(
      'Cannot found the music',
      'Cannot found the music',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK' },
      ],
      { cancelable: false }
    );
  };

  onBack = () => {
    const { currentPosition, selectedTrack } = this.state;

    if (currentPosition < 10 && selectedTrack > 0) {
      this.videoPlayer !== undefined && this.videoPlayer.seek(0);
      this.setState({ isChanging: true });
      setTimeout(
        () =>
          this.setState({
            currentPosition: 0,
            paused: false,
            duration: 1,
            isChanging: false,
            selectedTrack: selectedTrack - 1,
          }),
        0
      );
    } else {
      this.videoPlayer.seek(0);
      this.setState({
        currentPosition: 0,
      });
    }
  };

  onForward = () => {
    const { selectedTrack, shuffleOn } = this.state;
    const { playlist } = this.props;
    if (selectedTrack < playlist.tracks.length - 1) {
      this.videoPlayer !== undefined && this.videoPlayer.seek(0);
      this.setState({ isChanging: true });

      // Get the next tracks
      const nextTrack = shuffleOn
        ? Math.floor(Math.random() * playlist.tracks.length)
        : selectedTrack + 1;

      setTimeout(
        () =>
          this.setState({
            currentPosition: 0,
            duration: 1,
            paused: false,
            isChanging: false,
            selectedTrack: nextTrack,
          }),
        0
      );
    }
  };

  onEnd = () => {
    const { repeatOn } = this.state;
    if (repeatOn === true) {
      this.videoPlayer !== undefined && this.videoPlayer.seek(0);
    } else {
      this.onForward();
    }
  };

  render() {
    const { playlist } = this.props;

    const {
      selectedTrack,
      isChanging,
      paused,
      duration,
      currentPosition,
      repeatOn,
      shuffleOn,
    } = this.state;

    const track = playlist.tracks[selectedTrack];

    const video = isChanging ? null : (
      <Video
        source={{ uri: track.audioUrl }}
        ref={ref => {
          this.videoPlayer = ref;
        }}
        paused={paused} // Pauses playback entirely.
        resizeMode="cover" // Fill the whole screen at aspect ratio.
        // repeat={this.state.repeatOn}            // Repeat forever. ==> Not working, proceed by onEnd instead
        onLoadStart={this.loadStart} // Callback when video starts to load
        onLoad={this.setDuration} // Callback when video loads
        onProgress={this.setCurrentPosition} // Callback every ~250ms with currentTime
        onEnd={this.onEnd} // Callback when playback finishes
        onError={this.videoError} // Callback when video cannot be loaded
        style={styles.audioElement}
        rate={1.0}
        volume={1.0}
        muted={false}
        audioOnly
        playInBackground
      />
    );

    const playerView = (
      <View>
        <LinearGradient colors={['#2b3535', '#121212', '#121212']} style={styles.header} />
        <View style={{ position: 'absolute' }}>
          <StatusBar hidden />
          <Header
            message="PLAYING FROM CHARTS"
            onPlaylistPress={() => this.setState({ showPlaylist: true })}
          />
          <AlbumArt url={track.albumArtUrl} />
          <TrackDetails title={track.title} artist={track.artist} />
          <SeekBar
            onSliding={this.onSliding}
            duration={duration}
            currentPosition={currentPosition}
            onSlidingComplete={() => this.setState({ paused: false })}
          />
          <Controls
            onPressRepeat={() => this.setState({ repeatOn: !repeatOn })}
            repeatOn={repeatOn}
            shuffleOn={shuffleOn}
            forwardDisabled={selectedTrack === playlist.tracks.length - 1}
            onPressShuffle={() => this.setState({ shuffleOn: !shuffleOn })}
            onPressPlay={() => this.setState({ paused: false })}
            onPressPause={() => this.setState({ paused: true })}
            onBack={this.onBack}
            onForward={this.onForward}
            paused={paused}
          />
        </View>
      </View>
    );

    const playlistView = (
      <Playlist
        onBackPressed={() => {
          this.setState({ showPlaylist: false });
        }}
        playlist={playlist}
      />
    );

    const { showPlaylist } = this.state;

    return (
      <View style={styles.container}>
        {showPlaylist ? playlistView : playerView}
        {video}
      </View>
    );
  }
}

const { height, width } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'rgb(4,4,4)',
  },
  audioElement: {
    height: 0,
    width: 0,
  },
  header: {
    width: '100%',
    height: '100%',
  },
};

export default connect(state => {
  return { playlist: state.playlist };
})(PlayerPage);
