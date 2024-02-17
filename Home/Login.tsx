//Login.tsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface LoginProps {
  setIsLoginSuccessful: (value: boolean) => void;
  onLoginError: (errorMessage: string) => void;
}

const Login = ({setIsLoginSuccessful, onLoginError}: LoginProps) => {
  const [respBonseData, setResponseData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData().catch(error => {
      setIsLoginSuccessful(false);
      onLoginError(
        'Failed to authenticate. Please check your network connection and try again.',
      ); // Pass the error message to the callback
    });
  }, []);

  const fetchData = async () => {
    try {
      // Fetch credentials from the backend API
      const response = await axios.get(
        'https://bruh-api.cialabs.tech/credentials/',
      );
      const credentialsList = response.data;

      let loginSuccessful = false;
      let successfulCredID = null;

      // Loop through each set of credentials
      for (let i = 0; i < credentialsList.length; i++) {
        const credentials = credentialsList[i];

        const payload = {
          mode: '191',
          username: credentials.Username,
          password: credentials.Password,
        };

        const headers = {
          Accept: '*/*',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'en-US,en',
          Connection: 'keep-alive',
          'Content-Length': '81',
          'Content-Type': 'application/x-www-form-urlencoded',
          Host: '10.0.0.2:8090',
           Origin: 'http://10.0.0.2:8090',
          Referer: 'http://10.0.0.2:8090/httpclient.html',
          'Sec-GPC': '1',
          'User-Agent':
           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        };
        // Use credentials to make the login request
        console.log('Trying', credentials.CredID);
        const responseLogin = await fetch('http://10.0.0.2:8090/login.xml', {
          method: 'POST',
          headers: headers,
          body: new URLSearchParams(payload).toString(),
        });
        console.log('USED', credentials.Username, credentials.Password);
        /*Imporvements:
          Give timeout */

        if (!responseLogin.ok) {
          throw new Error('Network response was not ok');
        } else {
          const data = await responseLogin.text();
          setResponseData(data);
          console.log('Check1 works');
          // Check if login was successful
          if (data.includes('You are signed in as')) {
            loginSuccessful = true;
            successfulCredID = credentials.CredID;
            console.log('Login for ', credentials.CredID);
            break; // Exit the loop if login was successful
          } else {
            console.log('Login unsucessful for ', credentials.CredID);
          }
        }
      }

      if (!loginSuccessful) {
        throw new Error('Login unsuccessful for all credentials');
      } else {
        console.log('successfulCredID:', successfulCredID);
        await axios.post(`http://bruh-api.cialabs.tech/credentials/${successfulCredID}/increment/`);
        setIsLoginSuccessful(true);
        console.log('Login successful');
      }
    } catch (error: any) {
      setIsLoginSuccessful(false);
      if (error instanceof Error) {
        onLoginError(error.message);
      } else {
        onLoginError('An unexpected error occurred. Please try again later.');
      }
      console.log(error);
    }
  };

  return <></>;
};

export default Login;
