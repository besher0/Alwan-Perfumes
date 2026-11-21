import React,{useEffect,useState} from 'react';
import { Image,Pressable,ScrollView,View,useWindowDimensions } from 'react-native';
import { api } from '../lib/api';
import { Customer,CustomerAnalytics,NoteStat } from '../lib/types';
import { NOTE_IMAGES,noteLabel } from '../lib/notes';
import { C } from '../theme/colors';
import { AText,Card,Empty,ErrorText,NoteTag,ScreenHeading,SectionHeading } from '../components/UI';

function ChartList({rows,kind}:{rows:NoteStat[];kind:'rating'|'count'}){
 const max=kind==='count'?Math.max(1,...rows.map(r=>r.count)):5;
 return <View style={{gap:14}}>
 {rows.length===0?<AText size={11} color={C.muted}>لا توجد مشتريات لهذا العميل بعد.</AText>:rows.map(n=>{
  const val=kind==='count'?n.count:n.avgRating;
  return <View key={n.noteId} style={{flexDirection:'row-reverse',gap:10,alignItems:'center'}}>
    <Image source={NOTE_IMAGES[n.noteId]||NOTE_IMAGES.rose} style={{width:45,height:45,borderRadius:11}} />
    <View style={{flex:1,gap:4}}>
      <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center'}}><AText weight="bold" size={11}>{n.name}</AText><AText color={C.goldDeep} size={10}>{kind==='count'?`${n.count} مرات`:`${n.avgRating.toFixed(1)} ★`}</AText></View>
      <View style={{backgroundColor:C.goldLight,height:9,borderRadius:8,overflow:'hidden'}}><View style={{width:`${Math.min(100,val/max*100)}%`,height:'100%',backgroundColor:kind==='rating'?C.rose:C.gold,borderRadius:8,alignSelf:'flex-end'}}/></View>
    </View>
   </View>;
 })}
 </View>;
}

export function InsightsScreen({token,customers,initialCustomerId,onSelectCustomer}:{token:string;customers:Customer[];initialCustomerId:string;onSelectCustomer:(id:string)=>void}){
 const [stats,setStats]=useState<CustomerAnalytics|null>(null);const [error,setError]=useState('');
 const id=customers.some(c=>c.id===initialCustomerId)?initialCustomerId:customers[0]?.id||'';
 const c=customers.find(c=>c.id===id);
 useEffect(()=>{if(!id){setStats(null);return}let active=true;setStats(null);setError('');api.analytics(token,id)
  .then(data=>{if(active)setStats(data)}).catch(e=>{if(active)setError(e instanceof Error?e.message:'تعذر تحميل التحليلات')});return()=>{active=false};},[token,id]);
 return <View style={{gap:16}}>
  <ScreenHeading eyebrow="TASTE / PERSONAL ANALYTICS" title="تحليلات الذوق" description="إحصائيات الزبون المحدد فقط، بدون خلط بيانات العملاء."/>
  {!customers.length?<Empty text="سجل عميلًا أولًا لعرض التحليلات"/>:<>
   <Card><SectionHeading title="اختر العميل" description="يمكن الانتقال بين العملاء للاطلاع على بصمتهم العطرية"/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:'row-reverse',gap:8}}>
     {customers.map(customer=><Pressable key={customer.id} onPress={()=>onSelectCustomer(customer.id)} style={{paddingVertical:10,paddingHorizontal:13,borderRadius:10,borderColor:id===customer.id?C.gold:C.line,borderWidth:1,backgroundColor:id===customer.id?C.goldLight:C.white}}><AText weight="bold" size={11}>{customer.name}</AText></Pressable>)}
    </ScrollView>
   </Card>
   <ErrorText message={error}/>
   {!stats?<Empty text="جاري تحميل التحليلات..."/>:<>
    <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>
      <Card style={{flex:1,minWidth:145}}><AText color={C.muted} size={10}>عدد المشتريات</AText><AText weight="extra" size={26}>{stats.purchaseCount}</AText></Card>
      <Card style={{flex:1,minWidth:145}}><AText color={C.muted} size={10}>النوتة الأعلى تقييمًا</AText><AText weight="bold" size={14}>{stats.mostLiked[0]?.name||'—'} {stats.mostLiked[0]?`${stats.mostLiked[0].avgRating}★`:''}</AText></Card>
      <Card style={{flex:1,minWidth:145}}><AText color={C.muted} size={10}>النوتة الأكثر شراءً</AText><AText weight="bold" size={14}>{stats.mostPurchased[0]?.name||'—'} {stats.mostPurchased[0]?`(${stats.mostPurchased[0].count})`:''}</AText></Card>
    </View>
    <View style={{flexDirection:'row-reverse',gap:12,flexWrap:'wrap'}}>
      <Card style={{flex:1,minWidth:260}}><SectionHeading title="النوتات الأعلى تقييمًا" description="متوسط تقييم كل نوتة في مشتريات هذا الزبون"/><ChartList rows={stats.mostLiked} kind="rating"/></Card>
      <Card style={{flex:1,minWidth:260}}><SectionHeading title="النوتات الأكثر شراءً" description="عدد مرات ظهور كل نوتة في عمليات الشراء"/><ChartList rows={stats.mostPurchased} kind="count"/></Card>
    </View>
    <Card><SectionHeading title="النوتات المفضلة للزبون" description="تفضيلات اختارها العميل مباشرة"/>
     <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:7}}>{stats.favoriteNoteIds.length?stats.favoriteNoteIds.map(noteId=><NoteTag key={noteId} id={noteId}/>):<AText color={C.muted} size={11}>لم يحدد نوتات مفضلة.</AText>}</View>
    </Card>
   </>}
  </>}
 </View>;
}
