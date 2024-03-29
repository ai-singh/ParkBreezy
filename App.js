import "react-native-gesture-handler";
import React, { useEffect, useState, useRef } from "react";
import { firebase } from "./src/firebase/config";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  LoginScreen,
  HomeScreen,
  RegistrationScreen,
  MainScreen,
  MapScreen,
} from "./src/screens";
import { decode, encode } from "base-64";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import LanguageScreen from "./src/screens/LanguageScreen/LanguageScreen";
import LoadingScreen from "./src/screens/LoadingScreen/LoadingScreen";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

// For identifying the location of the database on a local machine.
console.log(FileSystem.documentDirectory);

export default function App() {
  const isLoading = useRef(true);
  const isGettingUser = useRef(true);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [user, setUser] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const db = SQLite.openDatabase("local.db");

  executeQuery = (sql, params = []) =>
    new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          sql,
          params,
          (tx, results) => {
            resolve(results);
          },
          (error) => {
            console.log("error");
            console.log(error);
            reject(error);
          }
        );
      });
    });

  useEffect(() => {
    async function getData() {
      /*let result = await executeQuery("SELECT * FROM user", []);
      let rows = result.rows;
      console.log(rows);
      return rows;*/
      return null;
    }
    getData().then((rows) => {
      isLoading.current = false;
      setUser(null);
      setIsFirstRender(false);
    });
  }, []);

  return (
    <>
      {isFirstRender ? (
        <></>
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            {user ? (
              user["is_logged"] ? (
                <Stack.Screen name="Map" component={MapScreen} style={{ headerLeft: null }} />
              ) : (
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerTransparent: true, title: "" }}
                />
              )
            ) : (
              <Stack.Screen
                name="Load"
                component={LoadingScreen}
                options={{
                  headerTintColor: "#000000",
                  headerTransparent: true,
                  title: "",
                }}
              />
            )}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerTintColor: "#000000" }}
            />
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{
                headerTintColor: "#000000",
                headerTransparent: true,
                title: "",
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerTintColor: "#000000",
                headerTransparent: true,
                title: "",
              }}
            />
            <Stack.Screen
              name="Language"
              component={LanguageScreen}
              options={{
                headerTintColor: "#000000",
                headerTransparent: true,
                title: "",
              }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{
                headerTintColor: "#000000",
                headerTransparent: true,
                title: "",
                headerLeft: null,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
