import { NativeModules } from 'react-native';

const { WidgetBridge } = NativeModules;

interface WidgetInterface {
  updateWidgetData(time: String, type: String): void;
}

export const updateWidget = (time: string, type: string) => {
  if (WidgetBridge) {
    WidgetBridge.updateWidgetData(time, type);
    console.log(`Widget Updated: ${time} - ${type}`);
  } else {
    console.warn("WidgetBridge native module is not available.");
  }
};