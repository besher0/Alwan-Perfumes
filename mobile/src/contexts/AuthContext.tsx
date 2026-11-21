import React, {createContext,useContext,useEffect,useMemo,useState} from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/api';

type AuthType={token:string|null;ready:boolean;login:(username:string,password:string)=>Promise<void>;logout:()=>Promise<void>};
const AuthContext=createContext<AuthType|null>(null);
const KEY='alwan_owner_access_token';
export function AuthProvider({children}:{children:React.ReactNode}){
 const [token,setToken]=useState<string|null>(null);const [ready,setReady]=useState(false);
 useEffect(()=>{(async()=>{try{if(Platform.OS!=='web')setToken(await SecureStore.getItemAsync(KEY));}catch{}finally{setReady(true)}})()},[]);
 const value=useMemo<AuthType>(()=>({
  token,ready,
  async login(username,password){const result=await api.login(username,password);if(Platform.OS!=='web')await SecureStore.setItemAsync(KEY,result.accessToken);setToken(result.accessToken);},
  async logout(){try{if(Platform.OS!=='web')await SecureStore.deleteItemAsync(KEY)}finally{setToken(null)}},
 }),[token,ready]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('AuthProvider missing');return ctx;}
