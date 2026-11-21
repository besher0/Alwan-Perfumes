import React,{useEffect,useMemo,useState} from 'react';
import {Image,Pressable,ScrollView,View,useWindowDimensions} from 'react-native';
import { AText,Button,Card,Empty,ErrorText,Field,NoteTag,NoteTile,ScreenHeading,SectionHeading,Stars } from '../components/UI';
import { FALLBACK_NOTES,noteLabel,today } from '../lib/notes';
import { C } from '../theme/colors';
import {Customer,NewPurchaseDto} from '../lib/types';

type Props={customers:Customer[];onCreateCustomer:()=>void;onSave:(value:NewPurchaseDto)=>Promise<void>;onSaveAndShare:(value:NewPurchaseDto)=>Promise<void>};
export function NewPurchaseScreen({customers,onCreateCustomer,onSave,onSaveAndShare}:Props){
 const {width}=useWindowDimensions();const tablet=width>=860;const roomy=width>=1360;
 const [customerId,setCustomerId]=useState(customers[0]?.id||'');const [perfumeName,setPerfumeName]=useState('');
 const [date,setDate]=useState(today());const [rating,setRating]=useState(5);const [noteIds,setNoteIds]=useState<string[]>([]);
 const [primary,setPrimary]=useState('');const [favoriteIds,setFavoriteIds]=useState<string[]>([]);
 const [error,setError]=useState('');const [saving,setSaving]=useState<'save'|'share'|null>(null);
 const selectedCustomer=customers.find(c=>c.id===customerId)||customers[0];
 useEffect(()=>{if(!customerId&&customers[0])setCustomerId(customers[0].id)},[customers,customerId]);
 useEffect(()=>{setFavoriteIds(selectedCustomer?.favoriteNoteIds||[])},[selectedCustomer?.id]);
 const formWidth=roomy?width-220-52-355:tablet?width-220-52:width-26;
 const columns=formWidth>=760?5:formWidth>=560?4:formWidth>=400?3:2;
 const tileWidth=Math.max(95,Math.floor((formWidth-38-10*(columns-1))/columns));
 const toggleNote=(id:string)=>{
  const next=noteIds.includes(id)?noteIds.filter(n=>n!==id):[...noteIds,id];setNoteIds(next);
  if(!next.includes(primary))setPrimary(next[0]||'');
  if(next.length===1)setPrimary(next[0]!);
 };
 const dto=():NewPurchaseDto=>({customerId:selectedCustomer?.id||'',perfumeName:perfumeName.trim(),purchasedAt:date,rating,primaryNoteId:primary,noteIds,favoriteNoteIds:favoriteIds});
 const submit=async(share:boolean)=>{
  setError('');
  if(!selectedCustomer){setError('اختر العميل أولًا');return;}
  if(perfumeName.trim().length<2){setError('يرجى إدخال اسم العطر');return;}
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){setError('صيغة التاريخ: YYYY-MM-DD');return;}
  if(!noteIds.length||!primary){setError('اختر نوتة واحدة على الأقل وحدد النوتة الرئيسية');return;}
  setSaving(share?'share':'save');try{await(share?onSaveAndShare(dto()):onSave(dto()))}catch(e){setError(e instanceof Error?e.message:'تعذر حفظ عملية الشراء')}finally{setSaving(null)};
 };
 const summary=<Card style={{gap:13}} padded={false}>
   <Image source={require('../assets/floral/perfume-hero.jpg')} resizeMode="cover" style={{width:'100%',height:roomy?192:144}} />
   <View style={{padding:16,gap:13}}>
    <SectionHeading title="ملخص عملية الشراء" description="معاينة تفاصيل العملية قبل الحفظ"/>
    {([['الزبون',selectedCustomer?.name||'—'],['رقم الهاتف',selectedCustomer?'+'+selectedCustomer.phone:'—'],['العطر',perfumeName||'—'],['تاريخ الشراء',date],['النوتة الرئيسية',primary?noteLabel(primary):'—']] as const).map(([label,val])=><View key={label} style={{flexDirection:'row-reverse',justifyContent:'space-between',borderBottomWidth:1,borderColor:C.line,paddingBottom:8,gap:12}}><AText color={C.muted} size={10}>{label}</AText><AText weight="bold" size={11} style={{flexShrink:1}}>{val}</AText></View>)}
    <Stars rating={rating} size={20}/>
    <AText weight="bold" size={11}>نوتات العطر</AText>
    <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{noteIds.length?noteIds.map(id=><NoteTag key={id} id={id}/>):<AText color={C.muted} size={10}>لم يتم الاختيار</AText>}</View>
    <AText weight="bold" size={11}>النوتات المفضلة للزبون</AText>
    <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{favoriteIds.length?favoriteIds.map(id=><NoteTag key={id} id={id}/>):<AText color={C.muted} size={10}>لم تُحدد</AText>}</View>
   </View>
 </Card>;
 return <View style={{gap:15}}>
   <ScreenHeading eyebrow="PURCHASE / NEW" title="شراء جديد" description="سجّل عملية شراء واربط مكونات العطر وتقييمه بملف العميل."/>
   {customers.length===0?<Card style={{gap:15}}><AText>لا يوجد عملاء. أضف أول عميل لتسجيل شراء.</AText><Button title="إضافة عميل" onPress={onCreateCustomer}/></Card>:
   <View style={{flexDirection:roomy?'row-reverse':'column',gap:16,alignItems:'flex-start'}}>
    <View style={{flex:roomy?1:undefined,width:roomy?undefined:'100%',gap:14}}>
     <Card style={{gap:16}}>
       <SectionHeading title="بيانات عملية الشراء" description="اختر الزبون وأدخل اسم العطر وتاريخ الشراء والتقييم"/>
       <AText weight="bold" size={11}>الزبون *</AText>
       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,flexDirection:'row-reverse'}}>
        {customers.map(c=><Pressable key={c.id} onPress={()=>setCustomerId(c.id)} style={{borderWidth:1,borderColor:selectedCustomer?.id===c.id?C.gold:C.line,borderRadius:11,backgroundColor:selectedCustomer?.id===c.id?C.goldLight:C.white,paddingVertical:8,paddingHorizontal:13}}>
         <AText size={10} weight="bold">{c.name}</AText>
        </Pressable>)}
       </ScrollView>
       <AText color={C.muted} size={10}>رقم الهاتف: {selectedCustomer?'+'+selectedCustomer.phone:'—'}</AText>
       <View style={{flexDirection:width>=620?'row-reverse':'column',gap:12}}>
        <Field label="اسم العطر *" value={perfumeName} onChangeText={setPerfumeName} placeholder="مثال: عود ملكي"/>
        <Field label="تاريخ الشراء *" value={date} onChangeText={setDate} placeholder="2026-11-21"/>
       </View>
       <View style={{flexDirection:'row-reverse',justifyContent:'space-between',flexWrap:'wrap',alignItems:'center',gap:12}}><AText weight="bold" size={11}>تقييم العميل (1–5 نجوم) *</AText><Stars rating={rating} onChange={setRating}/></View>
     </Card>
     <Card>
      <SectionHeading title="نوتات العطر" description="اختر النوتات الموجودة في هذا العطر. كل نوتة تحتوي على صورتها."/>
      <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>{FALLBACK_NOTES.map(n=><NoteTile key={n.id} id={n.id} selected={noteIds.includes(n.id)} onPress={()=>toggleNote(n.id)} width={tileWidth}/>)}</View>
      {noteIds.length?<View style={{marginTop:15,gap:9}}><AText weight="bold" size={11}>النوتة الرئيسية (اختر واحدة من المحددة)</AText>
       <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:7}}>{noteIds.map(id=><Pressable key={id} onPress={()=>setPrimary(id)} style={{paddingVertical:7,paddingHorizontal:12,borderRadius:11,backgroundColor:primary===id?C.goldLight:C.white,borderWidth:1,borderColor:primary===id?C.gold:C.line}}><AText size={10} weight="bold">{primary===id?'◉ ':'○ '}{noteLabel(id)}</AText></Pressable>)}</View></View>:null}
     </Card>
     <Card>
       <SectionHeading title="النوتات المفضلة للزبون" description="النوتات التي يحبها الزبون عادةً، وهي منفصلة عن نوتات العطر الذي اشتراه"/>
       <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>{FALLBACK_NOTES.map(n=><NoteTile key={n.id} id={n.id} selected={favoriteIds.includes(n.id)} width={tileWidth} onPress={()=>setFavoriteIds(old=>old.includes(n.id)?old.filter(v=>v!==n.id):[...old,n.id])}/>)}</View>
     </Card>
     <ErrorText message={error}/>
     <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>
      <Button title="حفظ العملية" loading={saving==='save'} disabled={saving!==null} onPress={()=>submit(false)}/>
      <Button title="حفظ وإرسال ملخص واتساب" variant="outline" loading={saving==='share'} disabled={saving!==null} onPress={()=>submit(true)}/>
     </View>
    </View>
    <View style={{width:roomy?320:'100%'}}>{summary}</View>
   </View>}
 </View>;
}
