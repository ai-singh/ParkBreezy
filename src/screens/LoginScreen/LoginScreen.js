import React, { useState } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styles from "./styles";
import { firebase } from "../../firebase/config";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const onFooterLinkPress = () => {
    navigation.navigate("Registration");
  };

  const togglePasswordDisplay = () => {
    setHidePassword(!hidePassword);
  };

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.");
              return;
            }
            const user = firestoreDocument.data();
            navigation.navigate("Map", { user: user }); // navigate to Map screen
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const background = require("../../../assets/background.png");

  const [loaded] = useFonts({
    Candara: require("../../../assets/fonts/Candara.ttf"),
    CandaraBold: require("../../../assets/fonts/Candara_Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ImageBackground
      source={background}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="true"
        contentContainerStyle={{
          flex: 1,
          marginTop: "40%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 45,
            fontFamily: "CandaraBold",
            width: "75%",
            textAlign: "left",
          }}
        >
          Welcome!
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "Candara",
            width: "75%",
            textAlign: "left",
          }}
        >
          You are a few clicks away from the city's best parking.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "75%",
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
            borderColor: "#BDBDBD",
            borderWidth: 1,
            padding: 5,
          }}
        >
          <Image
            source={require("../../../assets/account.png")}
            style={{ width: 20, height: 20, margin: 5 }}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "75%",
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 30,
            borderColor: "#BDBDBD",
            borderWidth: 1,
            padding: 5,
          }}
        >
          <Image
            source={require("../../../assets/lock.png")}
            style={{ width: 20, height: 20, margin: 5 }}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry={hidePassword}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => togglePasswordDisplay()}>
            <Image
              source={require("../../../assets/eye.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "75%",
            borderColor: "black",
            borderWidth: 0,
            alignItems: "center",
            alignSelf: "center",
            marginTop: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: 15,
              flexDirection: "row",
            }}
          >
            <Ionicons
              name="ios-checkbox-outline"
              size={20}
              color="black"
              style={{ marginTop: -3, marginBottom: -4 }}
            />
          </View>
          <Text style={{ fontSize: 14, fontFamily: "Candara", marginTop: 5 }}>
            {" "}
            Remember me?
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Candara",
              marginTop: 5,
              marginLeft: "20%",
            }}
          >
            {" "}
            Forgot Password?
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}></View>
        <TouchableOpacity style={styles.button} onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}
