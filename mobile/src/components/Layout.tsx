import React from 'react';
import { Image, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../theme/colors';
import { Page } from '../lib/types';
import { AText, Button } from './UI';

const NAV:{key:Page;label:string;symbol:string}[]=[
 {key:'dashboard',label:'الرئيسية',symbol:'⌂'},
 {key:'customers',label:'العملاء',symbol:'♙'},
 {key:'purchases',label:'المشتريات',symbol:'▤'},
 {key:'insights',label:'تحليلات الذوق',symbol:'◫'},
];

export function Layout({page,onChange,onLogout,children,refreshing,onRefresh}:{
 page:Page;onChange:(s:Page)=>void;onLogout:()=>void;children:React.ReactNode;refreshing?:boolean;onRefresh?:()=>void;
}){
 const {width}=useWindowDimensions();const tablet=width>=860;const narrow=width<430;
 const active=(key:Page)=>page===key||(page==='profile'&&key==='customers')||(page==='newPurchase'&&key==='purchases');
 const menu=()=><>{NAV.map(item=><Pressable key={item.key} onPress={()=>onChange(item.key)} accessibilityRole="button"
 style={({pressed})=>({flexDirection:'row-reverse',alignItems:'center',gap:12,paddingVertical:13,paddingHorizontal:13,borderRadius:11,
 backgroundColor:active(item.key)?'#685650':'transparent',opacity:pressed?.7:1})}>
 <AText size={18} color={active(item.key)?'#F4D6A6':'#E2CFC0'}>{item.symbol}</AText>
 <AText size={11} weight="bold" color={C.white}>{item.label}</AText>
 </Pressable>)}</>;
 return <SafeAreaView style={{flex:1,backgroundColor:C.background}} edges={['top','bottom','left','right']}>
 <View style={{flex:1,flexDirection:'row-reverse',backgroundColor:C.background}}>
 {tablet?<View style={{width:220,backgroundColor:C.sidebar,padding:17,paddingTop:28,overflow:'hidden'}}>
   <Image source={require('../assets/floral/sidebar.png')} resizeMode="stretch" style={{position:'absolute',bottom:-25,right:-18,width:210,height:480,opacity:.6}} />
   <View style={{alignItems:'flex-end',borderBottomWidth:1,borderBottomColor:'#ffffff22',paddingBottom:24,marginBottom:20}}>
    <AText size={23} weight="extra" color={C.white}>علوان للعطور ✦</AText>
    <AText size={9} color="#D6BFA9">ALWAN PERFUMES</AText>
   </View>
   <AText size={10} color="#CAB4A5" style={{marginBottom:12}}>القائمة الرئيسية</AText>
   <View style={{gap:8}}>{menu()}</View>
   <View style={{flex:1}}/>
   <Button title="تسجيل الخروج" onPress={onLogout} variant="outline" style={{borderColor:'#9D8272'}}/>
  </View>:null}
 <View style={{flex:1,minWidth:0}}>
 {!tablet?<View style={{backgroundColor:C.sidebar,paddingTop:10,paddingBottom:6,paddingHorizontal:12}}>
   <View style={{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
    <View><AText color={C.white} size={17} weight="extra">علوان للعطور ✦</AText><AText size={8} color="#C9B09E">ALWAN PERFUMES</AText></View>
    <Pressable onPress={onLogout} accessibilityRole="button" style={{padding:9,borderWidth:1,borderColor:'#705A4D',borderRadius:9}}><AText color={C.white} size={10}>خروج</AText></Pressable>
   </View>
   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:'row-reverse',gap:5,alignItems:'center',paddingBottom:3}}>
    {NAV.map(item=><Pressable key={item.key} onPress={()=>onChange(item.key)} style={{backgroundColor:active(item.key)?'#705A4E':'transparent',borderRadius:9,paddingVertical:7,paddingHorizontal:narrow?10:14}}>
      <AText color={C.white} weight="bold" size={10}>{item.label}</AText>
    </Pressable>)}
   </ScrollView>
 </View>:null}
 <ScrollView contentContainerStyle={{flexGrow:1,padding:tablet?26:narrow?13:19,paddingBottom:45}}
 keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
  {/* Shared decoration stays mounted across every screen, including on phones. */}
  <Image source={require('../assets/floral/header.png')} pointerEvents="none" resizeMode="contain" style={{position:'absolute',top:0,left:-12,width:tablet?500:280,height:tablet?164:93,opacity:.95}}/>
  <Image source={require('../assets/floral/pink-flower.png')} pointerEvents="none" resizeMode="contain" style={{position:'absolute',top:tablet?195:140,right:tablet?-75:-58,width:tablet?155:110,height:tablet?131:94,opacity:.45}}/>
  <View style={{width:'100%',maxWidth:1320,alignSelf:'center',zIndex:1}}>{children}</View>
 </ScrollView>
 </View>
 </View>
 </SafeAreaView>;
}
