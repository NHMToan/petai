import { registerRootComponent } from "expo";
import { registerGlobals } from "react-native-webrtc";

import App from "./App";

registerGlobals();
registerRootComponent(App);
