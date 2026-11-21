import React from 'react';
import { Image,Pressable,View,useWindowDimensions } from 'react-native';
import { Card,AText,Button,ScreenHeading,SectionHeading,Stars,Empty } from '../components/UI';
import { C } from '../theme/colors';
import { arDate } from '../lib/notes';
import { DashboardData,Purchase } from '../lib/types';

function Metric({title,value,icon}:{title:string;value:string|number;icon:string}){
 return <Card style={{flexGrow:1,flexBasis:155,gap:9,minHeight:119}}>
  <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center'}}><AText color={C.muted} size={11}>{title}</AText><AText size={19} color={C.gold}>{icon}</AText></View>
  <AText weight="extra" size={26}>{value}</AText>
 </Card>;
}

export function DashboardScreen({data,onAdd,onCustomer}:{data:DashboardData|null;onAdd:()=>void;onCustomer:(id:string)=>void}){
 const {width}=useWindowDimensions();const wide=width>=900;
 return <View style={{gap:18}}>
   <ScreenHeading eyebrow="ALWAN / DASHBOARD" title="مرحبًا في علوان للعطور" description="كل ما تحتاجه لإدارة عملائك ومشترياتهم، في مكان واحد."/>
   <Card padded={false} style={{flexDirection:wide?'row-reverse':'column',minHeight:wide?190:0}}>
    <View style={{flex:1,padding:21,justifyContent:'center',gap:12}}>
      <AText weight="extra" size={21}>عالم من الروائح والذكريات</AText>
      <AText color={C.muted} size={11}>سجّل كل عطر وتقييم، وتعرّف على ذوق كل زبون لاقتراح العطر المناسب في زيارته القادمة.</AText>
      <Button title="＋ تسجيل عملية شراء" onPress={onAdd} style={{alignSelf:'flex-start'}}/>
    </View>
    <Image source={require('../assets/floral/perfume-hero.jpg')} resizeMode="cover" style={{width:wide?260:'100%',height:wide?'100%':156}}/>
   </Card>
   <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:12}}>
    <Metric title="عدد العملاء" value={data?.customersCount??'—'} icon="♙"/>
    <Metric title="عمليات الشراء" value={data?.purchasesCount??'—'} icon="▤"/>
    <Metric title="متوسط التقييم" value={data?.averageRating?`${data.averageRating} ★`:'—'} icon="☆"/>
   </View>
   <Card>
    <SectionHeading title="آخر عمليات الشراء" description="أحدث مشتريات عملائك وتقييماتهم"/>
    {!data?.recentPurchases.length?<Empty text="لا توجد مشتريات بعد. ابدأ بإضافة أول عملية."/>:data.recentPurchases.map(p=><Pressable onPress={()=>onCustomer(p.customerId)} key={p.id}
     style={{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:12,paddingVertical:12,borderBottomWidth:1,borderColor:C.line}}>
      <View style={{flex:1,gap:3}}>
        <AText weight="bold" size={12}>{p.perfumeName}</AText>
        <AText color={C.muted} size={10}>{p.customer?.name||'زبون'} · {arDate(p.purchasedAt)}</AText>
      </View>
      <Stars rating={p.rating} size={14}/>
     </Pressable>)}
   </Card>
  </View>;
}
