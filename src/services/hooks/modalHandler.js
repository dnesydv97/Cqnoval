import {useState} from "react";

export function useModalHandler() {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const modalHandler = (value) => setIsModalVisible(value);

  return {isModalVisible, modalHandler};
}
