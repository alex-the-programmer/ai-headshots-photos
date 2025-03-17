/**
 * picker.tsx
 * 
 * This file serves as an entry point for the platform-specific picker components.
 * It automatically exports the appropriate picker implementation based on the platform.
 * 
 * Date: 2023-10-15
 */

import { Platform } from 'react-native';

// We need to handle platform-specific imports differently
// React Native's automatic platform-specific file resolution doesn't work with dynamic imports
let PickerComponent;

if (Platform.OS === 'ios') {
  PickerComponent = require('./picker.ios').default;
} else {
  PickerComponent = require('./picker.android').default;
}

export default PickerComponent;

// Note: This file is just a fallback in case neither platform-specific file exists. 