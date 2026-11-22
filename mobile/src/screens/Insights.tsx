import React,{useEffect,useState} from 'react';
import { Image,Pressable,ScrollView,View,useWindowDimensions } from 'react-native';
import { api } from '../lib/api';
import { Customer,CustomerAnalytics,NoteStat } from '../lib/types';
import { NOTE_IMAGES } from '../lib/notes';
import { C } from '../theme/colors';
import { AText,Button,Card,Empty,ErrorText,NoteTag,ScreenHeading,SectionHeading } from '../components/UI';

function Bars({rows,kind}:{rows:NoteStat[];kind:'rating'|'count'}){
  const max=kind==='count'?Math.max(1,...rows.map(r=>r.count)):5;
  return <View style={{gap:15}}>
    {!rows.length?<Empty text="التحليلات ستظهر بمجرد تسجيل شراء وتقييم."/>:rows.map(n=>{
      const value=kind==='count'?n.count:n.avgRating;
      return <View key={n.noteId} style={{flexDirection:'row-reverse',gap:9,alignItems:'center'}}>
        <Image source={NOTE_IMAGES[n.noteId]||NOTE_IMAGES.rose} resizeMode="contain" style={{width:32,height:34}}/>
        <AText weight="bold" size={10} style={{width:65}}>{n.name}</AText>
        <View style={{flex:1,backgroundColor:'#F1E7DF',height:9,borderRadius:10,overflow:'hidden'}}>
          <View style={{alignSelf:'flex-end',height:'100%',borderRadius:10,width: `${Math.min(100,value/max*100)}%` as `${number}%`,backgroundColor:kind==='rating'?C.gold:C.rose}}/>
        </View>
        <AText weight="bold" color={C.goldDeep} size={10} style={{minWidth:44,textAlign:'left'}}>{kind==='count'?`${n.count} ×`:`${n.avgRating.toFixed(1)} ★`}</AText>
      </View>;
    })}
  </View>;
}

function MiniStat({title,value,image}:{title:string;value:string|number;image?:string}){
  return <Card style={{flexGrow:1,flexBasis:160,minHeight:110,gap:9,padding:16}}>
    <AText color={C.muted} size={10}>{title}</AText>
    <View style={{flexDirection:'row-reverse',gap:8,alignItems:'center'}}>
      {image?<Image source={NOTE_IMAGES[image]||NOTE_IMAGES.rose} style={{width:48,height:49}} resizeMode="contain"/>:null}
      <AText weight="extra" size={image?14:22}>{value}</AText>
    </View>
  </Card>;
}

export function InsightsScreen({token,customers,initialCustomerId,onSelectCustomer,onShare}:{
 token:string;customers:Customer[];initialCustomerId:string;onSelectCustomer:(id:string)=>void;onShare?:(id:string)=>Promise<void>;
}){
  const [stats,setStats]=useState<CustomerAnalytics|null>(null);const [error,setError]=useState('');const {width}=useWindowDimensions();
  const wide=width>=1120;
  const id=customers.some(c=>c.id===initialCustomerId)?initialCustomerId:customers[0]?.id||'';
  useEffect(()=>{if(!id){setStats(null);return}let active=true;setStats(null);setError('');api.analytics(token,id)
    .then(data=>{if(active)setStats(data)}).catch(e=>{if(active)setError(e instanceof Error?e.message:'تعذر تحميل التحليلات')});return()=>{active=false};},[token,id]);
  return <View style={{gap:16}}>
    <ScreenHeading eyebrow="TASTE / PERSONAL ANALYTICS" title="تحليلات الذوق" description="كل النتائج تخص العميل المختار فقط؛ دون دمج بيانات العملاء الآخرين." icon="▥"/>
    {!customers.length?<Card><Empty text="سجل عميلًا أولًا لعرض تحليلات الذوق"/></Card>:<>
      <Card style={{gap:11}}>
        <SectionHeading title="اختر العميل" icon="♙" description="حدد أي زبون للاطلاع على بصمته العطرية"/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection:'row-reverse',gap:8}}>
          {customers.map(c=><Pressable key={c.id} onPress={()=>onSelectCustomer(c.id)} style={{paddingHorizontal:14,paddingVertical:9,borderRadius:10,backgroundColor:id===c.id?'#F1E2D2':'#FFFDFC',borderColor:id===c.id?C.gold:C.line,borderWidth:1}}>
            <AText weight="bold" size={11}>{c.name}</AText>
          </Pressable>)}
        </ScrollView>
      </Card>
      <ErrorText message={error}/>
      {!stats?<Card><Empty text="جاري تحميل التحليلات..."/></Card>:<>
        <View style={{flexDirection:'row-reverse',gap:12,flexWrap:'wrap'}}>
          <MiniStat title="عدد المشتريات" value={stats.purchaseCount}/>
          <MiniStat title="النوتة الأكثر إعجابًا" value={stats.mostLiked[0]?`${stats.mostLiked[0].name} (${stats.mostLiked[0].avgRating.toFixed(1)} ★)`:'—'} image={stats.mostLiked[0]?.noteId}/>
          <MiniStat title="النوتة الأكثر شراءً" value={stats.mostPurchased[0]?`${stats.mostPurchased[0].name} (${stats.mostPurchased[0].count} ×)`:'—'} image={stats.mostPurchased[0]?.noteId}/>
        </View>
        <View style={{flexDirection:wide?'row-reverse':'column',gap:14}}>
          <Card style={{flex:wide?1.2:undefined,minWidth:0}}><SectionHeading title="النوتات الأعلى تقييمًا" icon="☆" description="متوسط النجوم لكل نوتة ظهرت في مشتريات هذا العميل"/><Bars rows={stats.mostLiked} kind="rating"/></Card>
          <Card style={{flex:wide?1:undefined,minWidth:0}}><SectionHeading title="النوتات الأكثر شراءً" icon="▤" description="عدد عمليات الشراء التي احتوت على كل نوتة"/><Bars rows={stats.mostPurchased} kind="count"/></Card>
        </View>
        <Card style={{gap:13}}>
          <View style={{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10}}>
            <View style={{flex:1,minWidth:185}}><SectionHeading title="النوتات التي اختارها العميل كمفضّلة" icon="♡" description="تفضيلات صريحة، مستقلة عن التقييمات وتكرار الشراء"/></View>
            {onShare?<Button title="إرسال ملخصه" variant="light" onPress={()=>{void onShare(id).catch(e=>setError(e instanceof Error?e.message:'تعذر فتح واتساب'))}}/>:null}
          </View>
          <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:7}}>{stats.favoriteNoteIds.length?stats.favoriteNoteIds.map(noteId=><NoteTag key={noteId} id={noteId}/>):<AText color={C.muted} size={11}>لا توجد تفضيلات مسجلة.</AText>}</View>
        </Card>
      </>}
    </>}
  </View>;
}
