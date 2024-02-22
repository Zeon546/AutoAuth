import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import WifiReborn from 'react-native-wifi-reborn';

interface WifiDetailsProps {
  isConnectedToAtria: boolean;
  setIsConnectedToAtria: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoginSuccessful: React.Dispatch<React.SetStateAction<boolean>>;
}

const Wifidetails: React.FC<WifiDetailsProps> = ({
  isConnectedToAtria,
  setIsConnectedToAtria,
  /*setIsLoginSuccessful,*/
}) => {
  const [switchValue, setSwitchValue] = useState(false);

  useEffect(() => {
    permission();
    checkConnectionToAtria();
  }, []);

  useEffect(() => {
    setSwitchValue(isConnectedToAtria); // Update switchValue when isConnectedToAtria changes
  }, [isConnectedToAtria]);

  const checkConnectionToAtria = async () => {
    try {
      const ssid = await WifiReborn.getCurrentWifiSSID();
      const loginSuccessful = ssid === 'Atria'; // Check if connected to "Atria" network
      setIsConnectedToAtria(loginSuccessful);
      console.log(ssid);
    } catch (error) {
      setIsConnectedToAtria(false);
      console.error('Error checking WiFi connection:', error);
    }
  };

  const permission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location permission is required for WiFi connections',
          message:
            'The app needs location permission to scan for WiFi networks',
          buttonNegative: 'Deny',
          buttonPositive: 'Allow',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  return <></>;
};

export default Wifidetails;
