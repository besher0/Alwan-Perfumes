import React,{useState} from 'react';
import { Pressable,TextInput,View,useWindowDimensions } from 'react-native';
import { AText,Button,Card,Empty,ErrorText,Field,NoteTag,NoteGrid,ScreenHeading,SectionHeading } from '../components/UI';
import { C,FONT } from '../theme/colors';
import { FALLBACK_NOTES,noteLabel } from '../lib/notes';
import { Customer,Purchase } from '../lib/types';

export function CustomersScreen({customers,purchases,onAdd,onOpen}:{
  customers:Customer[];purchases:Purchase[];onAdd:(name:string,phone:string,favoriteNoteIds:string[])=>Promise<void>;onOpen:(id:string)=>void;
}){
  const [search,setSearch]=useState('');const [adding,setAdding]=useState(false);
  const [name,setName]=useState('');const [phone,setPhone]=useState('');const [favorites,setFavorites]=useState<string[]>([]);
  const [error,setError]=useState('');const [saving,setSaving]=useState(false);const {width}=useWindowDimensions();
  const available=width-(width>=820?282:38);const columns=available>=1050?3:available>=650?2:1;
  const gap=13;
  const filtered=customers.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.phone.includes(search.replace(/\D/g,'')));
  const submit=async()=>{setError('');if(name.trim().length<2){setError('اسم العميل مطلوب');return}if(phone.replace(/\D/g,'').length<8){setError('رقم الهاتف غير صالح');return}
    setSaving(true);try{await onAdd(name,phone,favorites);setName('');setPhone('');setFavorites([]);setAdding(false)}catch(e){setError(e instanceof Error?e.message:'تعذر الحفظ')}finally{setSaving(false)};
  };
  return <View style={{gap:17}}>
    <View style={{flexDirection:'row-reverse',alignItems:'center',flexWrap:'wrap',gap:13}}>
      <View style={{flex:1,minWidth:245}}><ScreenHeading eyebrow="CLIENTELLE / MEMBERS" title="العملاء" description="سجل لكل عميل مع مشترياته وتحليلات نوتاته العطرية." icon="♙"/></View>
      <Button title={adding?'إغلاق النموذج':'＋ عميل جديد'} onPress={()=>{setAdding(!adding);setError('')}}/>
    </View>
    {adding?<Card style={{gap:15}}>
      <SectionHeading title="تسجيل عميل جديد" description="يُستخدم رقم الهاتف لتعريف ملف العميل" icon="♙"/>
      <View style={{flexDirection:width>=610?'row-reverse':'column',gap:12}}>
        <Field label="اسم العميل *" value={name} onChangeText={setName} placeholder="الاسم الكامل" style={{flexGrow:1,flexShrink:1}} />
        <Field label="رقم الهاتف مع مفتاح الدولة *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+963 9xx xxx xxx" style={{flexGrow:1,flexShrink:1}}/>
      </View>
      <SectionHeading title="النوتات المفضلة لدى الزبون" description="اختياري، ويمكن تعديله لاحقًا" icon="♡"/>
      <NoteGrid notes={FALLBACK_NOTES} selectedIds={favorites} compact onToggle={id=>setFavorites(prev=>prev.includes(id)?prev.filter(v=>v!==id):[...prev,id])}/>
      <ErrorText message={error}/>
      <Button title="حفظ العميل" loading={saving} onPress={submit} style={{alignSelf:'flex-start'}}/>
    </Card>:null}
    <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <TextInput value={search} onChangeText={setSearch} placeholder="بحث بالاسم أو رقم الهاتف..." placeholderTextColor={C.muted}
        style={{minHeight:44,flexGrow:1,minWidth:220,maxWidth:450,backgroundColor:'#FFFDFC',borderWidth:1,borderColor:C.line,borderRadius:11,paddingHorizontal:14,fontFamily:FONT.regular,textAlign:'right',writingDirection:'rtl',color:C.ink,fontSize:12}}/>
      <AText size={10} color={C.muted}>{filtered.length} عملاء</AText>
    </View>
    {!filtered.length?<Card><Empty text="لا يوجد عملاء مطابقون للبحث"/></Card>:<View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap}}>
      {filtered.map(c=>{
        const mine=purchases.filter(p=>p.customerId===c.id);const count=mine.length||c.purchaseCount||0;
        const avg=mine.length?(mine.reduce((sum,p)=>sum+p.rating,0)/mine.length).toFixed(1)+' ★':'—';
        const frequency:Record<string,number>={};mine.forEach(p=>p.noteIds.forEach(id=>frequency[id]=(frequency[id]||0)+1));
        const top=Object.keys(frequency).sort((a,b)=>frequency[b]!-frequency[a]!)[0];
        return <Pressable key={c.id} onPress={()=>onOpen(c.id)} style={{width:columns===1?'100%':Math.floor((available-gap*(columns-1))/columns),minWidth:0}}>
          <Card style={{gap:13,minHeight:205,padding:17}}>
            <View style={{flexDirection:'row-reverse',alignItems:'center',gap:11}}>
              <View style={{width:50,height:50,borderRadius:15,backgroundColor:'#EDDFD1',alignItems:'center',justifyContent:'center'}}><AText size={18} color="#7A5036" weight="bold">{c.name[0]}</AText></View>
              <View style={{flex:1,gap:4}}><AText weight="bold" size={13}>{c.name}</AText><AText color={C.muted} size={10}>{'+'+c.phone}</AText></View>
            </View>
            <View style={{flexDirection:'row-reverse',borderTopWidth:1,borderBottomWidth:1,borderColor:C.line,paddingVertical:10,gap:8}}>
              {([['عمليات الشراء',String(count)],['متوسط التقييم',avg],['النوتة الأبرز',top?noteLabel(top):'—']] as const).map(([label,value])=><View key={label} style={{flex:1,gap:4}}><AText color={C.muted} size={9}>{label}</AText><AText weight="bold" size={12}>{value}</AText></View>)}
            </View>
            <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{c.favoriteNoteIds.slice(0,3).map(id=><NoteTag key={id} id={id}/>)}</View>
            <AText color={C.gold} weight="bold" size={10}>عرض الملف الشخصي  ←</AText>
          </Card>
        </Pressable>;
      })}
    </View>}
  </View>;
}
