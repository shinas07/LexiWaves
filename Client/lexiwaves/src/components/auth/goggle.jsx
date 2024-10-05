import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import * as jwtDecode from "jwt-decode";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';

const GoogleAuth = () => {
  const dispatch = useDispatch();

  const handleGoogleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode.jwtDecode(credentialResponse.credential);
    console.log(decoded);

    try {
      const response = await axios.post('http://localhost:8000/dj-rest-auth/google/', {
        access_token: credentialResponse.credential, // Send the entire credential
      });

      console.log(response.data);

      // Assuming the response includes user info and tokens
      dispatch(login({
        user: response.data.user,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token
      }));

      // Redirect or update UI as needed
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
};

export default GoogleAuth;