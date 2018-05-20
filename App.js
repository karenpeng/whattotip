import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import cropImage, { BOX_WIDTH, BOX_HEIGHT } from './image-processing';
import getVision from './request';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});

export default class BadInstagramCloneApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      results: {},
    };
  }

  getResult = base64 => {
    getVision(base64, results => {
      this.setState({ results });
    });
  };

  takePicture = async () => {
    if (!this.camera) {
      return;
    }
    const options = {
      quality: 0.6,
      base64: true,
    };
    const data = await this.camera.takePictureAsync(options);
    cropImage(data, this.getResult);
  };

  render() {
    console.log(this.state.results)
    return (
      <View style={styles.container}>
        <View style={{
          flex: 1,
          position: 'relative',
          width: '100%',
          height: '100%',
        }}>
          <View style={{flex: 1}}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style = {styles.preview}
              type={RNCamera.Constants.Type.back}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              flashMode={RNCamera.Constants.FlashMode.auto}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
            />
          </View>
          <View style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: [
              {translateX: BOX_WIDTH * -0.5},
              {translateY: BOX_HEIGHT * -0.5},
            ],
            width: BOX_WIDTH,
            height: BOX_HEIGHT,
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
          }}></View>
        </View>
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center',}}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style = {styles.capture}
          >
            <Text style={{fontSize: 14}}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
