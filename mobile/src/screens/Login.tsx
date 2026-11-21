import React,{useState} from 'react';
import { Image,KeyboardAvoidingView,Platform,View,useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { C } from '../theme/colors';
import { AText,Button,Card,ErrorText,Field } from '../components/UI';

export function LoginScreen(){
 const {width}=useWindowDimensions();const {login}=useAuth();
 const [username,setUsername]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 const submit=async()=>{setError('');setLoading(true);try{await login(username,password)}catch(e){setError(e instanceof Error?e.message:'تعذر تسجيل الدخول')}finally{setLoading(false)}};
 return <SafeAreaView style={{flex:1,backgroundColor:C.background}}><KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':undefined} style={{flex:1,justifyContent:'center',padding:16}}>
  <Image source={require('../assets/floral/header.png')} resizeMode="contain" style={{position:'absolute',top:10,left:-20,width:width>600?580:300,height:180}}/>
  <Card style={{width:'100%',maxWidth:430,alignSelf:'center',padding:24,gap:16}}>
   <View style={{alignItems:'center',marginBottom:8}}><AText size={27} weight="extra">علوان للعطور</AText><AText color={C.gold} size={11}>ALWAN PERFUMES · OWNER PORTAL</AText></View>
   <AText size={13} weight="bold">تسجيل دخول صاحب المحل</AText>
   <Field label="اسم المستخدم" value={username} onChangeText={setUsername} placeholder="اسم المستخدم"/>
   <Field label="كلمة المرور" value={password} onChangeText={setPassword} secure placeholder="••••••••"/>
   <ErrorText message={error}/>
   <Button title="دخول إلى لوحة الإدارة" loading={loading} disabled={!username.trim()||!password} onPress={submit}/>
   <AText size={10} color={C.muted} style={{textAlign:'center'}}>حساب خاص بصاحب المحل. الزبائن لا يحتاجون تسجيل دخول.</AText>
  </Card>
 </KeyboardAvoidingView></SafeAreaView>;
}
