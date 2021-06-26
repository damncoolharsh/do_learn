import React, { Component } from 'react';
import functions from '@react-native-firebase/functions'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import database from '@react-native-firebase/database'
import { FlatGrid } from 'react-native-super-grid'
import { ActivityIndicator } from 'react-native-paper';
import center from 'sources/component/atoms/center';
import { VideoOn } from 'assets';
import { VideoOff } from 'assets';
import { MicOn } from 'assets';
import { MicOff } from 'assets';
import { EndCall } from 'assets';

export default class LiveClass extends Component {
  _engine
  constructor(props) {
    super(props);
    this.state = {
      appId: '464d99d347b849ca9b178f665490f9a4',
      token: '',
      loading: true,
      selected: 'local',
      localAudio: true,
      localVideo: true,
      channelName: `${props.route.params.roomId}`,
      joinSucceed: false,
      peerIds: [],
    };
  }

  componentDidMount() {
    fetch('https://secure-sierra-69551.herokuapp.com/', {
      method: 'POST',
      body: JSON.stringify({
        channelName: `${this.props.route.params.roomId}`,
        uid: 0
      }),
      headers: { "Content-Type": "application/json" }
    }).then((res) => res.json()
      .then(response => {
        this.setState({ token: response.key, loading: false })
      }))

    this.init();
  }

  componentWillUnmount() {
    this._engine?.leaveChannel();
    database().ref(`/users/${this.state.channelName}/live_class`).set(false)
  }

  init = async () => {
    const { appId } = this.state;
    this._engine = await RtcEngine.create(appId);
    await this._engine.enableVideo();

    this._engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    this._engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const { peerIds } = this.state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        this.setState({
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIds } = this.state;
      this.setState({
        // Remove peer ID from state array
        peerIds: peerIds.filter((id) => id !== uid),
      });
    });

    // If Local user joins RTC channel
    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      this.setState({
        joinSucceed: true,
      });
    });
  };

  /**
   * @name startCall
   * @description Function to start the call
   */
  startCall = async () => {
    // Join Channel using null token and channel name
    this.setState({ loading: true });
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelName,
      null,
      0
    );
    this._engine.enableLocalAudio(this.state.localAudio)
    this._engine.enableLocalVideo(this.state.localVideo)
    this.setState({ loading: false })
    database().ref(`/users/${this.state.channelName}/live_class`).set(true)
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = async () => {
    await this._engine?.leaveChannel();
    database().ref(`/users/${this.state.channelName}/live_class`).set(false)
      .then(() => {
        this.setState({ peerIds: [], joinSucceed: false });
      })
  };

  render() {
    return (
      <View style={appStyle.parent}>
        <TouchableOpacity
          onPress={() => { navigation.goBack() }}
          style={{ position: 'absolute', left: 10, top: 0, zIndex: 1 }}>
          {/* <BackIcon width={18} /> */}
        </TouchableOpacity>
        <View style={appStyle.presentScreen}>
          <View style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}>
            {this.state.joinSucceed
              ? (this.state.selected === "local") || this.state.peerIds.length == 0
                ? <RtcLocalView.SurfaceView
                  style={styles.max}
                  channelId={this.state.channelName}
                  renderMode={VideoRenderMode.Hidden}
                />
                : <RtcRemoteView.SurfaceView
                  style={styles.max}
                  uid={this.state.selected}
                  channelId={this.state.channelName}
                  renderMode={VideoRenderMode.Hidden}
                  zOrderMediaOverlay={true}
                />
              : null}
          </View>
        </View>
        <View style={{ height: '40%' }}>
          {this.state.peerIds
            ? <FlatGrid
              data={this.state.peerIds}
              itemDimension={sizeWidth * 0.25}
              renderItem={(user) => {
                // console.log(remoteStream[user.item].name)
                return user.item === this.state.selected
                  ? <TouchableOpacity
                    onPress={() => { this.setState({ selected: 'local' }) }}
                    style={{
                      ...appStyle.remoteContainer,
                      backgroundColor: 'green'
                    }}>
                    <View style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
                      <RtcLocalView.SurfaceView
                        style={styles.remote}
                        channelId={this.state.channelName}
                        renderMode={VideoRenderMode.Hidden}
                      />
                    </View>
                    {/* <Text style={{color: 'white', paddingTop: 2, textAlign: 'center'}}>{remoteStream[user.item].name}</Text> */}
                  </TouchableOpacity>
                  : <TouchableOpacity
                    onPress={() => { this.setState({ selected: user.item }) }}
                    style={{
                      ...appStyle.remoteContainer
                    }}>
                    <View style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
                      <RtcRemoteView.SurfaceView
                        style={styles.remote}
                        uid={user.item}
                        channelId={this.state.channelName}
                        renderMode={VideoRenderMode.Hidden}
                        zOrderMediaOverlay={true}
                      />
                    </View>
                    {/* <Text style={{color: 'white', paddingTop: 2, textAlign: 'center'}}>{remoteStream[user.item].name}</Text> */}
                  </TouchableOpacity>
              }}
            />
            : null}
        </View>
        <View style={appStyle.navBar}>
          {this.state.loading
            ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <ActivityIndicator color="green" size="large" />
            </View>
            : <View style={styles.buttonHolder}>
              {!this.state.joinSucceed
                ? <>
                  <TouchableOpacity onPress={() => {
                    this.setState({ localVideo: !this.state.localVideo })
                  }}>
                    {this.state.localVideo
                      ? <VideoOn width={32} height={32} />
                      : <VideoOff width={32} height={32} />}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    this.setState({ localAudio: !this.state.localAudio })
                  }}>
                    {this.state.localAudio
                      ? <MicOn width={32} height={32} />
                      : <MicOff width={32} height={32} />}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.startCall} style={styles.button}>
                    <Text style={styles.buttonText}> Start Class </Text>
                  </TouchableOpacity>
                </>
                : <>
                  <TouchableOpacity onPress={this.endCall}>
                    <EndCall width={32} height={32} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    this._engine.enableLocalVideo(!this.state.localVideo)
                    this.setState({ localVideo: !this.state.localVideo })
                  }}>
                    {this.state.localVideo
                      ? <VideoOn width={32} height={32} />
                      : <VideoOff width={32} height={32} />}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    this._engine.enableLocalAudio(!this.state.localAudio)
                    this.setState({ localAudio: !this.state.localAudio })
                  }}>
                    {this.state.localAudio
                      ? <MicOn width={32} height={32} />
                      : <MicOff width={32} height={32} />}
                  </TouchableOpacity>
                </>}
            </View>}
        </View>
      </View>
    );
  }
}

const sizeWidth = Math.round(Dimensions.get('window').width)
const sizeHeight = Math.round(Dimensions.get('window').height)

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const styles = StyleSheet.create({
  max: {
    width: 300,
    height: '100%'
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  remote: {
    flex: 1,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});

const appStyle = StyleSheet.create({
  parent: {
    height: '100%'
  },
  presentScreen: {
    height: '50%',
    backgroundColor: '#4E4C67',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 8
  },
  remoteContainer: {
    borderRadius: 8,
    backgroundColor: '#5E5C75',
    padding: 4,
    height: sizeHeight * 0.15
  },
  remoteStream: {
  },

  present: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Open Sans',
    alignSelf: 'center',
  },
  navBar: {
    alignItems: 'center',
    height: '10%',
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-evenly'
  }
})