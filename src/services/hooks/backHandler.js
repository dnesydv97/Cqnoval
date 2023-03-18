import {useEffect} from "react";
import {BackHandler} from "react-native";

export const useBackHandler = (check, handler = () => {}) => {
  useEffect(() => {
    if (check) {
      BackHandler.addEventListener("hardwareBackPress", handler);
    }
    return () => BackHandler.removeEventListener("hardwareBackPress", handler);
  }, [check]);
};
