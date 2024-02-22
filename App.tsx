import React, {useState, useEffect} from 'react';
import {Switch, Text, View, Button} from 'react-native';
import Wifidetails from './Home/Wifidetails'
import Login from './Home/Login';

export default function State() {
  const [isConnectedToAtria, setIsConnectedToAtria] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    console.log('Connection status changed:', isConnectedToAtria);
    console.log('Login status changed:', isLoginSuccessful);
    // Update switch value based on both conditions
    setSwitchValue(isConnectedToAtria && isLoginSuccessful);
  }, [isConnectedToAtria, isLoginSuccessful]);

  const handleLoginError = (errorMessage: any) => {
    setLoginError(errorMessage);
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Wifidetails
        isConnectedToAtria={isConnectedToAtria}
        setIsConnectedToAtria={setIsConnectedToAtria}
        setIsLoginSuccessful={setIsLoginSuccessful}
      />
      {isConnectedToAtria && (
        <Login
          setIsLoginSuccessful={setIsLoginSuccessful}
          onLoginError={handleLoginError}
        />
      )}
      {loginError !== '' && <Text style={{color: 'red'}}>{loginError}</Text>}
      <View>
      <Text>Connected to Atria WiFi Network: {isConnectedToAtria ? 'Yes' : 'No'}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Switch value={switchValue} />
      </View>
    </View>
  );
}
