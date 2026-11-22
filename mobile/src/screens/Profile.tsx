import React,{useEffect,useState} from 'react';
import { Image,Pressable,View,useWindowDimensions } from 'react-native';
import { api } from '../lib/api';
import { Customer,CustomerAnalytics,NoteStat } from '../lib/types';
import { FALLBACK_NOTES,NOTE_IMAGES,arDate,noteLabel } from '../lib/notes';
import { C } from '../theme/colors';
import { AText,Button,Card,Empty,ErrorText,NoteTag,NoteTile,ScreenHeading,SectionHeading,Stars } from '../components/UI';

function TasteBars({rows}:{rows:NoteStat[]}){
  return <View style={{gap:15}}>
    {!rows.length?<Empty text="التحليلات ستظهر بعد تسجيل مشتريات العميل."/>:rows.slice(0,6).map(n=><View key={n.noteId} style={{flexDirection:'row-reverse',alignItems:'center',gap:8}}>
      <Image source={NOTE_IMAGES[n.noteId]||NOTE_IMAGES.rose} resizeMode="contain" style={{width:33,height:34}}/>
      <View style={{width:70}}><AText weight="bold" size={10}>{n.name}</AText></View>
      <View style={{flex:1,height:9,borderRadius:20,backgroundColor:'#F2E8E1',overflow:'hidden'}}><View style={{alignSelf:'flex-end',width: `${Math.min(100,n.avgRating/5*100)}%` as `${number}%`,height:'100%',borderRadius:20,backgroundColor:C.gold}}/></View>
      <AText color={C.goldDeep} size={10} weight="bold">{n.avgRating.toFixed(1)} ★</AText>
    </View>)}
  </View>;
}

export function ProfileScreen({token,id,onInsights,onShare,onBack,onNewPurchase}:{
 token:string;id:string;onInsights:()=>void;onShare:()=>Promise<void>;onBack:()=>void;onNewPurchase:()=>void;
}){
  const [customer,setCustomer]=useState<Customer|null>(null);const [stats,setStats]=useState<CustomerAnalytics|null>(null);
  const [error,setError]=useState('');const [editing,setEditing]=useState(false);const [editNotes,setEditNotes]=useState<string[]>([]);
  const [saving,setSaving]=useState(false);const {width}=useWindowDimensions();const wide=width>=1130;
  useEffect(()=>{let active=true;setCustomer(null);setStats(null);setError('');Promise.all([api.customer(token,id),api.analytics(token,id)])
    .then(([c,a])=>{if(active){setCustomer(c);setStats(a);setEditNotes(c.favoriteNoteIds)}})
    .catch(e=>{if(active)setError(e instanceof Error?e.message:'تعذر تحميل الملف')});return()=>{active=false};},[token,id]);
  const saveFavorites=async()=>{setSaving(true);setError('');try{const updated=await api.updateFavorites(token,id,editNotes);setCustomer(updated);setStats(await api.analytics(token,id));setEditing(false)}catch(e){setError(e instanceof Error?e.message:'تعذر الحفظ')}finally{setSaving(false)}};
  const available=width-(width>=820?282:38);const col=available>=650?5:available>=430?3:2;
  const tileWidth=Math.max(100,Math.floor((available-42-10*(col-1))/col));
  return <View style={{gap:16}}>
    <View style={{flexDirection:'row-reverse',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <View style={{flex:1,minWidth:240}}><ScreenHeading eyebrow="CLIENT / PROFILE" title="ملف العميل" description="سجل المشتريات وتفضيلات الذوق العطري لهذا الزبون." icon="♙"/></View>
      <Button title="＋ شراء جديد" onPress={onNewPurchase}/>
    </View>
    <ErrorText message={error}/>
    {!customer?<Card><Empty text="جاري تحميل ملف العميل..."/></Card>:<>
      <View style={{backgroundColor:'#3A2B27',padding:22,borderRadius:19,gap:18}}>
        <View style={{flexDirection:'row-reverse',alignItems:'center',gap:12}}>
          <View style={{width:57,height:57,borderRadius:17,backgroundColor:'#FFFFFF24',alignItems:'center',justifyContent:'center'}}><AText weight="extra" size={22} color={C.white}>{customer.name[0]}</AText></View>
          <View style={{flex:1,gap:4}}><AText weight="extra" size={20} color={C.white}>{customer.name}</AText><AText size={11} color="#E1C6B6">+{customer.phone} · عميل منذ {arDate(customer.createdAt)}</AText></View>
        </View>
        <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:25}}>
          <View style={{gap:4,minWidth:95}}><AText color="#D7BEAF" size={10}>المشتريات</AText><AText weight="extra" color={C.white} size={20}>{stats?.purchaseCount??0}</AText></View>
          <View style={{gap:4,minWidth:105}}><AText color="#D7BEAF" size={10}>متوسط التقييم</AText><AText weight="extra" color={C.white} size={19}>{stats?.purchaseCount?stats.averageRating.toFixed(1)+' ★':'—'}</AText></View>
          <View style={{gap:4,minWidth:95}}><AText color="#D7BEAF" size={10}>الأكثر شراءً</AText><AText weight="bold" color={C.white} size={17}>{stats?.mostPurchased[0]?.name||'—'}</AText></View>
        </View>
      </View>
      <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:10}}>
        <Button title="تحليلات ذوق هذا العميل" variant="light" onPress={onInsights}/>
        <Button title="إرسال ملخص واتساب" variant="outline" onPress={()=>{void onShare().catch(e=>setError(e instanceof Error?e.message:'تعذر فتح واتساب'))}}/>
        <Button title={editing?'إغلاق تعديل النوتات':'تعديل النوتات المفضلة'} variant="light" onPress={()=>{setEditing(!editing);setEditNotes(customer.favoriteNoteIds)}}/>
        <Button title="العودة للعملاء" variant="outline" onPress={onBack}/>
      </View>
      {editing?<Card style={{gap:13}}>
        <SectionHeading title="تعديل النوتات المفضلة" description="اختيارات يحددها العميل بنفسه، وهي منفصلة عن نوتات مشترياته" icon="♡"/>
        <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:9}}>{FALLBACK_NOTES.map(n=><NoteTile key={n.id} id={n.id} selected={editNotes.includes(n.id)} width={tileWidth} compact onPress={()=>setEditNotes(prev=>prev.includes(n.id)?prev.filter(v=>v!==n.id):[...prev,n.id])}/>)}</View>
        <View style={{flexDirection:'row-reverse',gap:8}}><Button title="حفظ التفضيلات" loading={saving} onPress={saveFavorites}/><Button title="إلغاء" variant="outline" onPress={()=>setEditing(false)}/></View>
      </Card>:null}
      <View style={{flexDirection:wide?'row-reverse':'column',gap:15,alignItems:'stretch'}}>
        <Card style={{flex:wide?1.25:undefined,minWidth:0}}>
          <SectionHeading title="مشتريات الزبون" icon="▤" description="تاريخ العطر والنوتات الموجودة فيه وتقييم العملية"/>
          {!customer.purchases?.length?<Empty text="لم يسجل هذا العميل أي شراء بعد"/>:customer.purchases.map(p=><View key={p.id} style={{borderWidth:1,borderColor:'#EDE2DA',borderRadius:12,padding:13,marginBottom:10,backgroundColor:'#FFFDFC',gap:9}}>
            <View style={{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}><AText weight="bold" size={13}>{p.perfumeName}</AText><Stars rating={p.rating} size={14}/></View>
            <AText size={10} color={C.muted}>{arDate(p.purchasedAt)} · النوتة الرئيسية: {noteLabel(p.primaryNoteId)}</AText>
            <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{p.noteIds.map(noteId=><NoteTag key={noteId} id={noteId}/>)}</View>
          </View>)}
        </Card>
        <Card style={{flex:wide?1:undefined,minWidth:0,gap:11}}>
          <SectionHeading title="بصمة الذوق العطري" icon="✿" description="متوسط تقييم النجوم لكل نوتة في مشتريات هذا العميل"/>
          <TasteBars rows={stats?.mostLiked||[]}/>
          <View style={{height:1,backgroundColor:C.line,marginVertical:8}}/>
          <SectionHeading title="النوتات المفضلة" icon="♡" description="اختيارات الزبون المباشرة"/>
          <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:7}}>{customer.favoriteNoteIds.length?customer.favoriteNoteIds.map(n=><NoteTag key={n} id={n}/>):<AText color={C.muted} size={10}>لم يحدد نوتات مفضلة بعد</AText>}</View>
          <View style={{height:1,backgroundColor:C.line,marginVertical:8}}/>
          <AText color={C.muted} size={11}>الأكثر شراءً: {stats?.mostPurchased[0]?.name||'—'}{stats?.mostPurchased[0]?` (${stats.mostPurchased[0].count} مرات)`:''}</AText>
        </Card>
      </View>
    </>}
  </View>;
}
