import React,{useCallback,useEffect,useState} from 'react';
import { ActivityIndicator,Alert,Linking,View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts,Almarai_400Regular,Almarai_700Bold,Almarai_800ExtraBold } from '@expo-google-fonts/almarai';
import { AuthProvider,useAuth } from './src/contexts/AuthContext';
import { Layout } from './src/components/Layout';
import { AText,Button,ErrorText } from './src/components/UI';
import { DashboardScreen } from './src/screens/Dashboard';
import { CustomersScreen } from './src/screens/Customers';
import { PurchasesScreen } from './src/screens/Purchases';
import { NewPurchaseScreen } from './src/screens/NewPurchase';
import { ProfileScreen } from './src/screens/Profile';
import { InsightsScreen } from './src/screens/Insights';
import { LoginScreen } from './src/screens/Login';
import { api,ApiError } from './src/lib/api';
import { Customer,DashboardData,NewPurchaseDto,Page,Purchase } from './src/lib/types';
import { C } from './src/theme/colors';

function Workspace(){
 const {token,ready,logout}=useAuth();const [page,setPage]=useState<Page>('dashboard');
 const [currentId,setCurrentId]=useState('');const [customers,setCustomers]=useState<Customer[]>([]);
 const [purchases,setPurchases]=useState<Purchase[]>([]);const [dashboard,setDashboard]=useState<DashboardData|null>(null);
 const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 const refresh=useCallback(async()=>{
   if(!token)return;
   setLoading(true);setError('');
   try{
    const [c,p,d]=await Promise.all([api.customers(token),api.purchases(token),api.dashboard(token)]);
    setCustomers(c);setPurchases(p);setDashboard(d);
    setCurrentId(prev=>prev&&c.some(x=>x.id===prev)?prev:c[0]?.id||'');
   }catch(e){
    if(e instanceof ApiError&&e.status===401){void logout();return;}
    setError(e instanceof Error?e.message:'تعذر تحميل البيانات');
   }finally{setLoading(false)};
 },[token,logout]);
 useEffect(()=>{void refresh()},[refresh]);
 if(!ready)return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:C.background}}><ActivityIndicator color={C.gold}/></View>;
 if(!token)return <LoginScreen/>;
 const openCustomer=(id:string)=>{setCurrentId(id);setPage('profile')};
 const openInsights=(id:string)=>{setCurrentId(id);setPage('insights')};
 const addCustomer=async(name:string,phone:string,favorites:string[])=>{
   const newC=await api.createCustomer(token,{name,phone,favoriteNoteIds:favorites});await refresh();setCurrentId(newC.id);setPage('profile');
 };
 const savePurchase=async(dto:NewPurchaseDto)=>{
  const p=await api.createPurchase(token,dto);await refresh();openCustomer(p.customerId);
 };
 const openWhatsApp=async(customerId:string)=>{
  const share=await api.share(token,customerId);
  const url=`https://wa.me/${share.phone}?text=${encodeURIComponent(share.message)}`;
  const supported=await Linking.canOpenURL(url);
  if(!supported)throw new Error('تعذر فتح واتساب. تأكد من تثبيته أو افتح الرابط عبر المتصفح.');
  await Linking.openURL(url);
 };
 const savePurchaseAndShare=async(dto:NewPurchaseDto)=>{
  const p=await api.createPurchase(token,dto);await refresh();openCustomer(p.customerId);
  try{await openWhatsApp(p.customerId)}catch(e){Alert.alert('تم حفظ العملية','انحفظت عملية الشراء، لكن تعذر فتح واتساب: '+(e instanceof Error?e.message:''))}
 };
 return <Layout page={page} onChange={setPage} onLogout={()=>{void logout()}} refreshing={loading} onRefresh={refresh}>
  <StatusBar style="dark"/>
  {error?<View style={{marginBottom:13,gap:7}}><ErrorText message={error}/><Button title="إعادة المحاولة" onPress={()=>{void refresh()}} variant="outline"/></View>:null}
  {page==='dashboard'?<DashboardScreen data={dashboard} onAdd={()=>setPage('newPurchase')} onCustomer={openCustomer}/>:null}
  {page==='customers'?<CustomersScreen customers={customers} onAdd={addCustomer} onOpen={openCustomer}/>:null}
  {page==='purchases'?<PurchasesScreen purchases={purchases} onAdd={()=>setPage('newPurchase')} onCustomer={openCustomer}/>:null}
  {page==='newPurchase'?<NewPurchaseScreen customers={customers} onCreateCustomer={()=>setPage('customers')} onSave={savePurchase} onSaveAndShare={savePurchaseAndShare}/>:null}
  {page==='profile'&&currentId?<ProfileScreen token={token} id={currentId} onBack={()=>setPage('customers')} onNewPurchase={()=>setPage('newPurchase')} onInsights={()=>openInsights(currentId)} onShare={()=>openWhatsApp(currentId)}/>:null}
  {page==='insights'?<InsightsScreen token={token} customers={customers} initialCustomerId={currentId} onSelectCustomer={setCurrentId}/>:null}
 </Layout>;
}

export default function App(){
 const [fontsLoaded]=useFonts({Almarai_400Regular,Almarai_700Bold,Almarai_800ExtraBold});
 if(!fontsLoaded)return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:C.background}}><ActivityIndicator color={C.gold}/></View>;
 return <AuthProvider><Workspace/></AuthProvider>;
}
