import React from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { AText, Button, Card, Empty, NoteTag, ScreenHeading, SectionHeading, Stars } from '../components/UI';
import { C } from '../theme/colors';
import { arDate, noteLabel } from '../lib/notes';
import { Customer, DashboardData, Purchase } from '../lib/types';

function Metric({title,value,description,icon}:{title:string;value:string|number;description:string;icon:string}){
  return <Card style={{flexGrow:1,flexBasis:160,minHeight:122,gap:5,padding:17}}>
    <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center'}}>
      <AText color={C.muted} size={10}>{title}</AText>
      <View style={{width:34,height:34,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'#F4E9DE'}}><AText color={C.gold} size={18}>{icon}</AText></View>
    </View>
    <AText weight="extra" size={26}>{value}</AText>
    <AText color={C.muted} size={9}>{description}</AText>
  </Card>;
}

export function DashboardScreen({data,customers,purchases,onAdd,onCustomer,onPurchases,onInsights}:{
  data:DashboardData|null;customers:Customer[];purchases:Purchase[];onAdd:()=>void;onCustomer:(id:string)=>void;onPurchases:()=>void;onInsights:(id:string)=>void;
}){
  const {width}=useWindowDimensions();const wide=width>=1050;const table=width>=760;
  const spotlight=customers[0];const mine=spotlight?purchases.filter(p=>p.customerId===spotlight.id):[];
  const frequency:Record<string,number>={};for(const p of mine)for(const id of p.noteIds)frequency[id]=(frequency[id]||0)+1;
  const topNote=Object.keys(frequency).sort((a,b)=>frequency[b]!-frequency[a]!)[0];
  const myAvg=mine.length?(mine.reduce((s,p)=>s+p.rating,0)/mine.length).toFixed(1):'—';
  const recent=data?.recentPurchases||[];
  return <View style={{gap:17}}>
    <ScreenHeading eyebrow="ALWAN / OVERVIEW" title="الرئيسية" description="لوحة إدارة العملاء والمشتريات والذوق العطري." icon="✧"/>
    <View style={{backgroundColor:'#3D2D29',padding:25,borderRadius:20,gap:13,overflow:'hidden',minHeight:161,justifyContent:'center'}}>
      <AText size={95} color="#FFFFFF0A" style={{position:'absolute',left:12,top:-18}}>✿</AText>
      <AText size={10} weight="bold" color="#D7AC75" style={{letterSpacing:1.2}}>ALWAN / OVERVIEW</AText>
      <AText weight="extra" size={wide?24:21} color={C.white}>عالم من العطور والذوق الرفيع</AText>
      <AText size={11} color="#E0CDC1">كل عميل له ملفه، مشترياته، بصمته العطرية وتفضيلاته الخاصة.</AText>
      <Button title="＋ تسجيل عملية شراء" onPress={onAdd} style={{alignSelf:'flex-start',minWidth:155}}/>
    </View>
    <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:12}}>
      <Metric title="إجمالي العملاء" value={data?.customersCount??'—'} description="ملفات عملاء في المتجر" icon="♙"/>
      <Metric title="إجمالي المشتريات" value={data?.purchasesCount??'—'} description="عملية شراء مسجلة" icon="▤"/>
      <Metric title="متوسط تقييم العطور" value={data?.purchasesCount?`${data.averageRating.toFixed(1)} ★`:'—'} description="من أصل خمس نجوم" icon="☆"/>
      <Metric title="عملاء لديهم تفضيلات" value={customers.filter(c=>c.favoriteNoteIds.length).length} description="ملفات بذوق عطري محدد" icon="♡"/>
    </View>
    <View style={{flexDirection:wide?'row-reverse':'column',gap:15,alignItems:'stretch'}}>
      <Card style={{flex:wide?1.15:undefined,minWidth:0}}>
        <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:8,marginBottom:12}}>
          <AText weight="bold" size={15}>أحدث عمليات الشراء</AText>
          <Pressable onPress={onPurchases}><AText color={C.gold} size={11} weight="bold">عرض الكل</AText></Pressable>
        </View>
        {!recent.length?<Empty text="لا توجد عمليات شراء بعد."/>:<View style={{gap:0}}>
          {table?<View style={{flexDirection:'row-reverse',padding:10,backgroundColor:'#FBF1E9',borderRadius:9,marginBottom:4}}>
            {['العميل','العطر','النوتة','التاريخ','التقييم'].map(label=><AText key={label} weight="bold" color="#8C705B" size={9} style={{flex:1}}>{label}</AText>)}
          </View>:null}
          {recent.slice(0,4).map(p=><Pressable key={p.id} onPress={()=>onCustomer(p.customerId)} style={{paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.line,gap:7}}>
            {table?<View style={{flexDirection:'row-reverse',alignItems:'center',gap:5}}>
              <AText style={{flex:1}} size={10} weight="bold">{p.customer?.name||'زبون'}</AText>
              <AText style={{flex:1}} size={10}>{p.perfumeName}</AText>
              <AText style={{flex:1}} size={10} color={C.muted}>{noteLabel(p.primaryNoteId)}</AText>
              <AText style={{flex:1}} size={9} color={C.muted}>{arDate(p.purchasedAt)}</AText>
              <View style={{flex:1}}><Stars rating={p.rating} size={11}/></View>
            </View>:<>
              <View style={{flexDirection:'row-reverse',justifyContent:'space-between',gap:8}}><AText weight="bold" size={12}>{p.perfumeName}</AText><Stars rating={p.rating} size={13}/></View>
              <AText color={C.muted} size={10}>{p.customer?.name||'زبون'} · {arDate(p.purchasedAt)} · {noteLabel(p.primaryNoteId)}</AText>
            </>}
          </Pressable>)}
        </View>}
      </Card>
      <Card style={{flex:wide?1:undefined,minWidth:0}}>
        <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:8,marginBottom:12}}>
          <AText weight="bold" size={15}>لمحة عن ذوق أحد العملاء</AText>
          {spotlight?<Pressable onPress={()=>onInsights(spotlight.id)}><AText color={C.gold} weight="bold" size={10}>تحليلات هذا العميل</AText></Pressable>:null}
        </View>
        {!spotlight?<Empty text="لا يوجد عملاء بعد."/>:<View style={{backgroundColor:'#F3EAE2',padding:19,borderRadius:15,gap:11}}>
          <View style={{flexDirection:'row-reverse',alignItems:'center',gap:11}}>
            <View style={{width:50,height:50,borderRadius:15,backgroundColor:'#DED0C5',alignItems:'center',justifyContent:'center'}}><AText size={20} weight="bold" color="#754D35">{spotlight.name[0]}</AText></View>
            <View style={{flex:1,gap:3}}><AText size={16} weight="bold">{spotlight.name}</AText><AText size={10} color={C.muted}>{mine.length} عمليات شراء · متوسط التقييم {myAvg}</AText></View>
          </View>
          <AText size={10} color={C.muted}>النوتات المفضلة التي حددها الزبون:</AText>
          <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{spotlight.favoriteNoteIds.length?spotlight.favoriteNoteIds.map(id=><NoteTag key={id} id={id}/>):<AText color={C.muted} size={10}>لم يحدد نوتات مفضلة</AText>}</View>
          <AText size={11} color={C.muted}>الأكثر شراءً لديه: {topNote?noteLabel(topNote):'—'}</AText>
          <Pressable onPress={()=>onCustomer(spotlight.id)}><AText color={C.gold} weight="bold" size={11}>فتح ملف العميل ←</AText></Pressable>
        </View>}
      </Card>
    </View>
  </View>;
}
