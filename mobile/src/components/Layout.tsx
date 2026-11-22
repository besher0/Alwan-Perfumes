import React from 'react';
import { ImageBackground, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { C } from '../theme/colors';
import { Page } from '../lib/types';
import { AText, Button } from './UI';

const NAV:{key:Page;label:string;symbol:string}[]=[
  {key:'dashboard',label:'الرئيسية',symbol:'▦'},
  {key:'customers',label:'العملاء',symbol:'♙'},
  {key:'purchases',label:'المشتريات',symbol:'▤'},
  {key:'insights',label:'تحليلات الذوق',symbol:'▥'},
];
const pageName=(page:Page)=>page==='dashboard'?'الرئيسية':page==='customers'?'العملاء':page==='purchases'?'المشتريات':page==='newPurchase'?'شراء جديد':page==='profile'?'ملف العميل':'تحليلات الذوق';

export function Layout({page,onChange,onLogout,children,refreshing,onRefresh}:{
  page:Page;onChange:(s:Page)=>void;onLogout:()=>void;children:React.ReactNode;refreshing?:boolean;onRefresh?:()=>void;
}) {
  const {width,height}=useWindowDimensions();
  const tablet=width>=820;const narrow=width<430;
  const active=(key:Page)=>page===key||(page==='profile'&&key==='customers')||(page==='newPurchase'&&key==='purchases');
  const currentDate=new Intl.DateTimeFormat('ar',{day:'numeric',month:'long'}).format(new Date());
  const menu=()=><>{NAV.map(item=><Pressable key={item.key} accessibilityRole="button" onPress={()=>onChange(item.key)}
    style={({pressed})=>({flexDirection:'row-reverse',alignItems:'center',gap:12,paddingVertical:13,paddingHorizontal:14,borderRadius:11,
      backgroundColor:active(item.key)?'#6B5750':'transparent',opacity:pressed?0.75:1})}>
      <AText size={19} color={active(item.key)?'#F4D6A6':'#E2CFC0'}>{item.symbol}</AText>
      <AText size={11} weight="bold" color={C.white}>{item.label}</AText>
    </Pressable>)}</>;
  return <SafeAreaView style={{flex:1,backgroundColor:C.background}} edges={['top','bottom','left','right']}>
    <StatusBar style="dark" backgroundColor={C.background}/>
    <View style={{flex:1,flexDirection:'row-reverse'}}>
      {tablet?<View style={{width:226,backgroundColor:C.sidebar,paddingHorizontal:17,paddingTop:28,paddingBottom:17,overflow:'hidden'}}>
        <View pointerEvents="none" style={{position:'absolute',width:250,height:250,borderRadius:125,borderWidth:1,borderColor:'#B58B6539',bottom:-110,right:-80}}/>
        <View pointerEvents="none" style={{position:'absolute',width:190,height:190,borderRadius:95,borderWidth:1,borderColor:'#B58B6525',bottom:-82,right:-45}}/>
        <View style={{flexDirection:'row-reverse',alignItems:'center',gap:10,paddingBottom:26,marginBottom:22,borderBottomWidth:1,borderBottomColor:'#FFFFFF20'}}>
          <View style={{width:44,height:44,backgroundColor:'#FFFFFF0D',borderColor:'#BE986B',borderWidth:1,borderRadius:12,alignItems:'center',justifyContent:'center'}}>
            <AText size={25} color="#E9BF85">✦</AText>
          </View>
          <View style={{flex:1}}><AText size={18} weight="extra" color="#FFF8F1">علوان للعطور</AText><AText size={9} color="#D9C2B2" style={{textAlign:'left'}}>ALWAN PERFUMES</AText></View>
        </View>
        <AText size={10} color="#C6B3A8" style={{marginBottom:15}}>القائمة الرئيسية</AText>
        <View style={{gap:6}}>{menu()}</View>
        <View style={{flex:1}}/>
        <AText color="#D2B9A7" size={9} style={{marginBottom:11}}>بوتيك علوان للعطور</AText>
        <Button title="تسجيل الخروج" onPress={onLogout} variant="outline" style={{backgroundColor:'#58443D',borderColor:'#856B5F'}}/>
      </View>:null}
      <ImageBackground
        source={width>height?require('../assets/floral/login-landscape.jpg'):require('../assets/floral/login-portrait.jpg')}
        style={{flex:1,minWidth:0,backgroundColor:C.background}}
        imageStyle={{opacity:0.25}}
        resizeMode="cover"
      >
        {!tablet?<View style={{backgroundColor:C.sidebar,paddingTop:12,paddingBottom:8,paddingHorizontal:13}}>
          <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',marginBottom:9}}>
            <View style={{gap:1}}><AText color={C.white} size={17} weight="extra">علوان للعطور ✦</AText><AText size={8} color="#D4BCAA">ALWAN PERFUMES</AText></View>
            <Pressable onPress={onLogout} style={{paddingVertical:8,paddingHorizontal:12,borderWidth:1,borderColor:'#856F61',borderRadius:10}}><AText color={C.white} size={10}>خروج</AText></Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:'row-reverse',gap:6,paddingBottom:2}}>
            {NAV.map(item=><Pressable key={item.key} onPress={()=>onChange(item.key)} style={{backgroundColor:active(item.key)?'#705950':'transparent',borderRadius:9,paddingVertical:8,paddingHorizontal:narrow?11:15}}>
              <AText color={C.white} size={10} weight="bold">{item.label}</AText>
            </Pressable>)}
          </ScrollView>
        </View>:null}
        <ScrollView contentContainerStyle={{flexGrow:1,paddingHorizontal:tablet?25:narrow?13:19,paddingTop:tablet?20:14,paddingBottom:45}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{width:'100%',maxWidth:1350,alignSelf:'center',gap:20}}>
            <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:10,minHeight:30}}>
              <View style={{flexDirection:'row-reverse',gap:8,alignItems:'center',flexShrink:1}}>
                <AText color={C.muted} size={10}>علوان</AText><AText color="#C7B8AE" size={10}>/</AText>
                <AText weight="bold" size={10}>{pageName(page)}</AText>
              </View>
              <AText color={C.muted} size={10}>{currentDate}  ◷</AText>
            </View>
            {children}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  </SafeAreaView>;
}
