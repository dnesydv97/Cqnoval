import {useState} from "react";

const initialState = {
  message: "",
  operation: "",
  agreeText: "YES",
  disAgreeText: null,
  visibility: false,
};

export function useExitAlertState() {
  const [alertInfo, setAlertInfo] = useState(initialState);

  const showExitAppDialog = () => {
    setAlertInfo({
      visibility: true,
      message: "Do you really want to close the application?",
      agreeText: "YES",
      disAgreeText: "NO",
    });
  };

  const dismissExitAppDialog = () => setAlertInfo(initialState);

  return {alertInfo, showExitAppDialog, dismissExitAppDialog};
}
