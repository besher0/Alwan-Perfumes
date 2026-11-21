import React,{useState} from 'react';
import { Pressable,TextInput,View } from 'react-native';
import { AText,Button,Card,Empty,NoteTag,ScreenHeading,Stars } from '../components/UI';
import { C,FONT } from '../theme/colors';
import { arDate } from '../lib/notes';
import { Purchase } from '../lib/types';

export function PurchasesScreen({purchases,onAdd,onCustomer}:{purchases:Purchase[];onAdd:()=>void;onCustomer:(id:string)=>void}){
 const [search,setSearch]=useState('');const filtered=purchases.filter(p=>p.perfumeName.includes(search)||(p.customer?.name||'').includes(search));
 return <View style={{gap:16}}>
  <ScreenHeading eyebrow="PURCHASES / HISTORY" title="المشتريات" description="كل المشتريات والتقييمات الموثّقة ضمن ملفات العملاء."/>
  <Button title="＋ تسجيل عملية شراء جديدة" onPress={onAdd} style={{alignSelf:'flex-start'}}/>
  <TextInput value={search} onChangeText={setSearch} placeholder="بحث باسم العطر أو الزبون" placeholderTextColor={C.muted}
   style={{height:46,borderRadius:12,backgroundColor:C.white,borderColor:C.line,borderWidth:1,paddingHorizontal:15,fontFamily:FONT.regular,textAlign:'right',writingDirection:'rtl'}}/>
  {!filtered.length?<Empty text="لا توجد عمليات شراء مطابقة"/>:filtered.map(p=><Pressable key={p.id} onPress={()=>onCustomer(p.customerId)}>
    <Card style={{gap:8}}>
      <View style={{flexDirection:'row-reverse',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
       <View style={{flex:1}}><AText weight="bold" size={14}>{p.perfumeName}</AText><AText color={C.muted} size={10}>{p.customer?.name||'العميل'} · {arDate(p.purchasedAt)}</AText></View>
       <Stars rating={p.rating} size={17}/>
      </View>
      <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{p.noteIds.map(id=><NoteTag key={id} id={id}/>)}</View>
    </Card>
   </Pressable>)}
 </View>;
}
