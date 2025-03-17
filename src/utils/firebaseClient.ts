import { initializeApp, getApps } from "firebase/app";

const initializeFirebaseClient = (config: any) => {
  if (!getApps().length) {
    initializeApp(config);
  }
};

export default initializeFirebaseClient;
