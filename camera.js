import React from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }

  pickImage = async () => {
    try {
      var result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        this.setState({ image: result.data });
        this.uploadImage(result.uri);
      }
    } catch (e) {
      console.log(e);
    }
  };

  uploadImage = async (uri) => {
    const data = new FormData();
    var fileName = uri.split("/")[uri.split("/").length - 1];
    var type = 'image/${uri.split(".")[uri.split(".").length - 1]}';
    const fileToUpload = {
      uri: uri,
      name: fileName,
      type: type,
    };
    data.append("alphabet", fileToUpload);
    fetch("https://f292a3137990.ngrok.io/predict-alphabet", {
      method: "POST",
      body: data,
      headers: {
        "content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  render() {
    let { image } = this.state;
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity
          style={{ width: 100, height: 100 }}
          onPress={() => {
            this.pickImage();
          }}
        >
          <Text>Select an Image</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
