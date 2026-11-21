import React,{useState} from 'react';
import { Pressable,TextInput,View,useWindowDimensions } from 'react-native';
import { AText,Button,Card,Empty,ErrorText,Field,NoteTag,NoteTile,ScreenHeading,SectionHeading } from '../components/UI';
import { C,FONT } from '../theme/colors';
import { FALLBACK_NOTES } from '../lib/notes';
import { Customer } from '../lib/types';

export function CustomersScreen({customers,onAdd,onOpen}:{customers:Customer[];onAdd:(name:string,phone:string,favoriteNoteIds:string[])=>Promise<void>;onOpen:(id:string)=>void}){
 const [search,setSearch]=useState('');const [adding,setAdding]=useState(false);
 const [name,setName]=useState('');const [phone,setPhone]=useState('');const [favorites,setFavorites]=useState<string[]>([]);
 const [error,setError]=useState('');const [saving,setSaving]=useState(false);const {width}=useWindowDimensions();
 const container=width>=860?width-284:width-54;const cols=container>=900?5:container>=600?4:container>=420?3:2;
 const cardWidth=Math.max(90,Math.floor((container-40-10*(cols-1))/cols));
 const filtered=customers.filter(c=>c.name.includes(search)||c.phone.includes(search.replace(/\D/g,'')));
 const submit=async()=>{setError('');if(name.trim().length<2){setError('اسم العميل مطلوب');return}if(phone.replace(/\D/g,'').length<8){setError('رقم الهاتف غير صالح');return}
  setSaving(true);try{await onAdd(name,phone,favorites);setName('');setPhone('');setFavorites([]);setAdding(false)}catch(e){setError(e instanceof Error?e.message:'تعذر الحفظ')}finally{setSaving(false)};
 };
 return <View style={{gap:16}}>
  <ScreenHeading eyebrow="CLIENTELLE / MEMBERS" title="العملاء" description="كل زبون إله ملف مستقل يضم مشترياته وتقييماته ونوتاته المفضلة."/>
  <Button title={adding?'إغلاق النموذج':'＋ إضافة عميل جديد'} onPress={()=>{setAdding(!adding);setError('')}} style={{alignSelf:'flex-start'}}/>
  {adding?<Card style={{gap:14}}>
    <SectionHeading title="تسجيل عميل جديد" description="يُستخدم رقم الهاتف كمفتاح فريد لملف العميل"/>
    <View style={{flexDirection:width>=600?'row-reverse':'column',gap:12}}>
     <Field label="اسم العميل *" value={name} onChangeText={setName} placeholder="الاسم الكامل" />
     <Field label="رقم الهاتف مع مفتاح الدولة *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+963 9xx xxx xxx"/>
    </View>
    <SectionHeading title="النوتات التي يفضلها الزبون" description="اختيار اختياري، ويمكن تعديله من ملف العميل لاحقًا"/>
    <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>
     {FALLBACK_NOTES.map(note=><NoteTile key={note.id} id={note.id} width={cardWidth} selected={favorites.includes(note.id)} onPress={()=>setFavorites(prev=>prev.includes(note.id)?prev.filter(id=>id!==note.id):[...prev,note.id])}/>)}
    </View>
    <ErrorText message={error}/>
    <Button title="حفظ العميل" loading={saving} onPress={submit} style={{alignSelf:'flex-start'}}/>
   </Card>:null}
  <Card style={{gap:8}}>
    <AText weight="bold" size={11}>بحث في العملاء</AText>
    <TextInput value={search} onChangeText={setSearch} placeholder="ابحث بالاسم أو رقم الهاتف" placeholderTextColor={C.muted}
      style={{height:43,backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:11,paddingHorizontal:13,fontFamily:FONT.regular,textAlign:'right',writingDirection:'rtl',color:C.ink}}/>
  </Card>
  {!filtered.length?<Empty text="لا يوجد عملاء مطابقون للبحث"/>:<View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:12}}>
   {filtered.map(c=><Pressable key={c.id} onPress={()=>onOpen(c.id)} style={{width:width>=900?'48%':'100%'}}>
     <Card style={{gap:10}}>
      <View style={{flexDirection:'row-reverse',alignItems:'center',gap:11}}>
       <View style={{width:42,height:42,borderRadius:21,backgroundColor:C.goldLight,alignItems:'center',justifyContent:'center'}}><AText weight="extra" color={C.goldDeep} size={18}>{c.name[0]}</AText></View>
       <View style={{flex:1}}><AText size={13} weight="bold">{c.name}</AText><AText color={C.muted} size={10}>{'+'+c.phone}</AText></View>
       <AText color={C.gold} size={12}>عرض الملف ←</AText>
      </View>
      <AText size={10} color={C.muted}>عدد المشتريات: {c.purchaseCount??0}</AText>
      <View style={{flexDirection:'row-reverse',gap:7,flexWrap:'wrap'}}>{c.favoriteNoteIds.slice(0,4).map(id=><NoteTag key={id} id={id}/>)}</View>
     </Card>
    </Pressable>)}
   </View>}
 </View>;
}
