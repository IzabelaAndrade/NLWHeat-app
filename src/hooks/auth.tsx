import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

const CLIENT_ID = 'f24d757aa4fd79d2ed7f';
const SCOPE = 'read:user';
const USER_STORAGE = '@nlwheat:user';
const TOKEN_STORAGE = '@nlwheat:token';

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;

}


type AuthContextData = {
  user: User | null;
  isSignIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

type AuthResponse = {
  token: string;
  user: User;
}


type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}


export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
  children: React.ReactNode;
}

function AuthProvider({children}: AuthProvider) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  
  async function signIn() {
    try {
      setIsSignIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?scope=${SCOPE}&client_id=${CLIENT_ID}`;
      const authSessionresponse = await AuthSession.startAsync({authUrl}) as AuthorizationResponse;
  
      if (authSessionresponse.type === 'success' && authSessionresponse.params.error !== 'access_denied') {
          const authResponse = await api.post('/authenticate', {
            code: authSessionresponse.params.code,
          });
          const {token, user} = authResponse.data as AuthResponse;
          console.log(authResponse.data);
  
          api.defaults.headers.common['authorization'] = `Bearer ${token}`;
  
          await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
          await AsyncStorage.setItem(TOKEN_STORAGE, token);
  
          setUser(user)
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsSignIn(false);
      
    }

  }

  async function  signOut() {
    setUser(null);
    AsyncStorage.removeItem(USER_STORAGE);
    AsyncStorage.removeItem(TOKEN_STORAGE);
  }
  
  useEffect(() => {
    async function loaduserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (userStorage && tokenStorage) {
        api.defaults.headers.common['authorization'] = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage))

      }
      setIsSignIn(false);
    }
    loaduserStorageData();
  },[])


  return(
    <AuthContext.Provider value={{signIn, signOut, user, isSignIn}}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export {
  AuthProvider,
  useAuth,
}