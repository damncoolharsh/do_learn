/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.js';
import React from 'react'
import {AuthProvider} from 'sources/providers/authProvider'
import {name as appName} from './app.json';

export default function Main() {
    return (
      <AuthProvider>
        <App />
      </AuthProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
