import React,{useEffect,useState} from 'react';
import {Pressable,View,useWindowDimensions } from 'react-native';
import { api } from '../lib/api';
import { Customer,CustomerAnalytics } from '../lib/types';
import { FALLBACK_NOTES,arDate,noteLabel } from '../lib/notes';
import { C } from '../theme/colors';
import { AText,Button,Card,Empty,ErrorText,NoteTag,NoteTile,ScreenHeading,SectionHeading,Stars } from '../components/UI';

export function ProfileScreen({token,id,onInsights,onShare,onBack,onNewPurchase}: {
 token:string;id:string;onInsights:()=>void;onShare:()=>Promise<void>;onBack:()=>void;onNewPurchase:()=>void;
}) {
 const [customer,setCustomer]=useState<Customer|null>(null);const [stats,setStats]=useState<CustomerAnalytics|null>(null);
 const [error,setError]=useState('');const [editing,setEditing]=useState(false);const [editNotes,setEditNotes]=useState<string[]>([]);
 const [saving,setSaving]=useState(false);const {width}=useWindowDimensions();
 useEffect(()=>{let active=true;setCustomer(null);setStats(null);setError('');Promise.all([api.customer(token,id),api.analytics(token,id)])
  .then(([c,a])=>{if(active){setCustomer(c);setStats(a);setEditNotes(c.favoriteNoteIds)}})
  .catch(e=>{if(active)setError(e instanceof Error?e.message:'تعذر تحميل الملف')});return()=>{active=false};},[token,id]);
 const handleSave=async()=>{setSaving(true);setError('');try{const updated=await api.updateFavorites(token,id,editNotes);setCustomer(updated);setStats(await api.analytics(token,id));setEditing(false)}catch(e){setError(e instanceof Error?e.message:'تعذر الحفظ')}finally{setSaving(false)}};
 const col=width>=1000?5:width>=620?4:2;const tileWidth=width>=860?110:Math.floor((width-90-(col-1)*9)/col);
 return <View style={{gap:15}}>
  <ScreenHeading eyebrow="CLIENTELLE / PROFILE" title="الملف الشخصي للعميل" description="جميع المشتريات والتفضيلات والتقييمات الخاصة بهذا العميل فقط."/>
  <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}><Button title="العودة للعملاء" variant="outline" onPress={onBack}/><Button title="＋ شراء جديد" onPress={onNewPurchase}/></View>
  <ErrorText message={error}/>
  {!customer?<Empty text="جاري تحميل ملف العميل..."/>:<>
   <Card style={{gap:12}}>
     <View style={{flexDirection:'row-reverse',alignItems:'center',gap:14}}>
      <View style={{width:56,height:56,borderRadius:28,backgroundColor:C.goldLight,alignItems:'center',justifyContent:'center'}}><AText weight="extra" size={24} color={C.goldDeep}>{customer.name[0]}</AText></View>
      <View style={{flex:1}}><AText weight="extra" size={20}>{customer.name}</AText><AText color={C.muted} size={11}>+{customer.phone}</AText></View>
     </View>
     <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>
      <Button title="عرض تحليلات الذوق" variant="light" onPress={onInsights}/>
      <Button title="إرسال ملخص المشتريات عبر واتساب" variant="outline" onPress={()=>{void onShare().catch(e=>setError(e instanceof Error?e.message:"تعذر فتح واتساب"))}}/>
     </View>
   </Card>
   <Card>
    <SectionHeading title="النوتات المفضلة للعميل" description="يختارها العميل مباشرة، وليس بناءً على عدد المشتريات"/>
    <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:8,marginBottom:14}}>{customer.favoriteNoteIds.map(id=><NoteTag key={id} id={id}/>)}</View>
    {editing?<>
      <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:9}}>{FALLBACK_NOTES.map(n=><NoteTile key={n.id} id={n.id} width={tileWidth} selected={editNotes.includes(n.id)} onPress={()=>setEditNotes(prev=>prev.includes(n.id)?prev.filter(v=>v!==n.id):[...prev,n.id])}/>)}</View>
      <View style={{flexDirection:'row-reverse',gap:8,marginTop:12}}><Button title="حفظ النوتات" loading={saving} onPress={handleSave}/><Button title="إلغاء" variant="outline" onPress={()=>{setEditing(false);setEditNotes(customer.favoriteNoteIds)}}/></View>
     </>:<Button title="تعديل النوتات المفضلة" variant="light" style={{alignSelf:'flex-start'}} onPress={()=>setEditing(true)}/>}
   </Card>
   <View style={{flexDirection:'row-reverse',gap:10,flexWrap:'wrap'}}>
    <Card style={{flex:1,minWidth:135}}><AText size={10} color={C.muted}>عدد المشتريات</AText><AText weight="extra" size={25}>{stats?.purchaseCount??customer.purchases?.length??0}</AText></Card>
    <Card style={{flex:1,minWidth:135}}><AText size={10} color={C.muted}>متوسط التقييم</AText><AText weight="extra" size={25}>{stats?.averageRating||'—'} ★</AText></Card>
   </View>
   <Card>
    <SectionHeading title="سجل مشتريات العميل" description="اسم العطر، تاريخ الشراء، نوتاته، وتقييم النجوم"/>
    {!(customer.purchases||[]).length?<Empty text="لم يسجل هذا العميل أي شراء بعد"/>:customer.purchases?.map(p=><View key={p.id} style={{paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.line,gap:7}}>
      <View style={{flexDirection:'row-reverse',justifyContent:'space-between',gap:8,alignItems:'center',flexWrap:'wrap'}}><AText weight="bold" size={13}>{p.perfumeName}</AText><AText color={C.muted} size={10}>{arDate(p.purchasedAt)}</AText></View>
      <Stars rating={p.rating} size={16}/>
      <AText size={10} color={C.muted}>النوتة الرئيسية: {noteLabel(p.primaryNoteId)}</AText>
      <View style={{flexDirection:'row-reverse',gap:6,flexWrap:'wrap'}}>{p.noteIds.map(noteId=><NoteTag key={noteId} id={noteId}/>)}</View>
     </View>)}
   </Card>
  </>}
 </View>;
}
