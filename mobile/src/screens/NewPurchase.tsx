import React,{useEffect,useState} from 'react';
import {Image,Pressable,ScrollView,View,useWindowDimensions} from 'react-native';
import { AText,Button,Card,ErrorText,Field,NoteTag,NoteTile,ScreenHeading,SectionHeading,Stars } from '../components/UI';
import { FALLBACK_NOTES,noteLabel,today } from '../lib/notes';
import { C } from '../theme/colors';
import {Customer,NewPurchaseDto} from '../lib/types';

type Props={customers:Customer[];onCreateCustomer:()=>void;onSave:(value:NewPurchaseDto)=>Promise<void>;onSaveAndShare:(value:NewPurchaseDto)=>Promise<void>};
export function NewPurchaseScreen({customers,onCreateCustomer,onSave,onSaveAndShare}:Props){
  const {width}=useWindowDimensions();
  const tablet=width>=820;const available=width-(tablet?282:40);const roomy=available>=860;
  const formWidth=roomy?available-322:available;
  const cols=formWidth>=750?5:formWidth>=570?4:formWidth>=410?3:2;
  const tileWidth=Math.max(92,Math.floor((formWidth-46-10*(cols-1))/cols));
  const favoriteCols=formWidth>=750?6:cols;
  const favoriteWidth=Math.max(82,Math.floor((formWidth-46-9*(favoriteCols-1))/favoriteCols));
  const [customerId,setCustomerId]=useState(customers[0]?.id||'');const [perfumeName,setPerfumeName]=useState('');
  const [date,setDate]=useState(today());const [rating,setRating]=useState(5);const [noteIds,setNoteIds]=useState<string[]>([]);
  const [primary,setPrimary]=useState('');const [favoriteIds,setFavoriteIds]=useState<string[]>([]);
  const [error,setError]=useState('');const [saving,setSaving]=useState<'save'|'share'|null>(null);
  const selectedCustomer=customers.find(c=>c.id===customerId)||customers[0];
  useEffect(()=>{if(!customerId&&customers[0])setCustomerId(customers[0].id)},[customers,customerId]);
  useEffect(()=>{setFavoriteIds(selectedCustomer?.favoriteNoteIds||[])},[selectedCustomer?.id]);
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
  const summary=<Card padded={false} style={{gap:0}}>
    <Image source={require('../assets/floral/perfume-hero.jpg')} resizeMode="cover" style={{width:'100%',height:roomy?200:160}}/>
    <View style={{padding:16,gap:12}}>
      <SectionHeading title="ملخص عملية الشراء" icon="▤" description="معاينة تفاصيل العملية قبل الحفظ"/>
      {([['العميل',selectedCustomer?.name||'—'],['رقم الهاتف',selectedCustomer?'+'+selectedCustomer.phone:'—'],['العطر',perfumeName||'—'],['تاريخ الشراء',date],['النوتة الرئيسية',primary?noteLabel(primary):'—']] as const).map(([label,val])=><View key={label} style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',borderBottomWidth:1,borderBottomColor:C.line,paddingBottom:9,gap:10}}><AText color={C.muted} size={10}>{label}</AText><AText weight="bold" size={11} style={{flexShrink:1}}>{val}</AText></View>)}
      <View style={{flexDirection:'row-reverse',justifyContent:'space-between',gap:10,alignItems:'center'}}><AText size={10} color={C.muted}>تقييم العميل</AText><Stars rating={rating} size={17}/></View>
      <AText weight="bold" size={11}>نوتات العطر</AText>
      <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{noteIds.length?noteIds.map(id=><NoteTag key={id} id={id}/>):<AText color={C.muted} size={10}>لم يتم الاختيار</AText>}</View>
      <AText weight="bold" size={11}>النوتات المفضلة للزبون</AText>
      <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{favoriteIds.length?favoriteIds.map(id=><NoteTag key={id} id={id}/>):<AText color={C.muted} size={10}>لم تُحدد</AText>}</View>
    </View>
  </Card>;
  return <View style={{gap:17}}>
    <ScreenHeading eyebrow="PURCHASE / NEW" title="شراء جديد" description="تسجيل عملية شراء جديدة وإضافة تفاصيل العطر والذوق العطري للعميل." icon="▤"/>
    {!customers.length?<Card style={{gap:14}}><AText size={12}>لا يوجد عملاء. أضف أول عميل لتسجيل شراء.</AText><Button title="إضافة عميل" onPress={onCreateCustomer} style={{alignSelf:'flex-start'}}/></Card>:
    <View style={{flexDirection:roomy?'row-reverse':'column',gap:15,alignItems:'flex-start'}}>
      <View style={{flex:roomy?1:undefined,width:roomy?undefined:'100%',gap:14,minWidth:0}}>
        <Card style={{gap:14}}>
          <SectionHeading title="بيانات عملية الشراء" description="أدخل تفاصيل العميل والعطر الذي تم شراؤه" icon="▤"/>
          <AText weight="bold" size={11}>اسم العميل *</AText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:8,flexDirection:'row-reverse'}}>
            {customers.map(c=><Pressable key={c.id} onPress={()=>setCustomerId(c.id)} style={{borderWidth:1,borderColor:selectedCustomer?.id===c.id?C.gold:C.line,borderRadius:10,backgroundColor:selectedCustomer?.id===c.id?C.goldLight:C.white,paddingVertical:9,paddingHorizontal:14}}><AText size={11} weight="bold">{c.name}</AText></Pressable>)}
          </ScrollView>
          <View style={{flexDirection:formWidth>=490?'row-reverse':'column',gap:12}}>
            <Field label="رقم الهاتف" value={selectedCustomer?'+'+selectedCustomer.phone:'—'} editable={false} style={{flexGrow:1}}/>
            <Field label="اسم العطر *" value={perfumeName} onChangeText={setPerfumeName} placeholder="مثال: عود ملكي" style={{flexGrow:1}}/>
          </View>
          <View style={{flexDirection:formWidth>=490?'row-reverse':'column',gap:12}}>
            <Field label="تاريخ الشراء *" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" style={{flexGrow:1}}/>
            <View style={{flexGrow:1,flexShrink:1,gap:8}}><AText weight="bold" size={11}>النوتة الرئيسية *</AText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:7,alignItems:'center',flexDirection:'row-reverse'}}>
                {noteIds.length?noteIds.map(id=><Pressable key={id} onPress={()=>setPrimary(id)} style={{borderWidth:1,borderColor:primary===id?C.gold:C.line,borderRadius:10,paddingVertical:8,paddingHorizontal:10,backgroundColor:primary===id?C.goldLight:C.white}}><AText size={10} weight="bold">{primary===id?'◉ ':'○ '}{noteLabel(id)}</AText></Pressable>):<AText color={C.muted} size={10}>اختر نوتات العطر أولًا</AText>}
              </ScrollView>
            </View>
          </View>
          <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}><AText weight="bold" size={11}>تقييم العميل *</AText><Stars rating={rating} onChange={setRating} size={25}/></View>
        </Card>
        <Card>
          <SectionHeading title="نوتات العطر" description="اختر النوتات العطرية الموجودة في هذا العطر. يمكنك اختيار أكثر من نوتة." icon="✿"/>
          <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>{FALLBACK_NOTES.map(n=><NoteTile key={n.id} id={n.id} selected={noteIds.includes(n.id)} onPress={()=>toggleNote(n.id)} width={tileWidth}/>)}</View>
        </Card>
        <Card>
          <SectionHeading title="النوتات المفضلة للعميل" description="النوتات التي يحبها الزبون عادةً، مستقلة عن تركيب العطر الحالي." icon="♡"/>
          <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:9}}>{FALLBACK_NOTES.map(n=><NoteTile key={n.id} id={n.id} selected={favoriteIds.includes(n.id)} width={favoriteWidth} compact onPress={()=>setFavoriteIds(prev=>prev.includes(n.id)?prev.filter(x=>x!==n.id):[...prev,n.id])}/>)}</View>
        </Card>
        <ErrorText message={error}/>
        <View style={{flexDirection:'row-reverse',gap:10,flexWrap:'wrap'}}>
          <Button title="حفظ العملية" loading={saving==='save'} disabled={saving!==null} onPress={()=>submit(false)} style={{minWidth:145}}/>
          <Button title="إرسال ملخص للزبون" variant="outline" loading={saving==='share'} disabled={saving!==null} onPress={()=>submit(true)} style={{minWidth:145}}/>
        </View>
      </View>
      <View style={{width:roomy?300:'100%'}}>{summary}</View>
    </View>}
  </View>;
}
