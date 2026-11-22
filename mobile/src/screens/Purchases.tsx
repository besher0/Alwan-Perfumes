import React,{useState} from 'react';
import { Pressable,TextInput,View,useWindowDimensions } from 'react-native';
import { AText,Button,Card,Empty,NoteTag,ScreenHeading,Stars } from '../components/UI';
import { C,FONT } from '../theme/colors';
import { arDate,noteLabel } from '../lib/notes';
import { Purchase } from '../lib/types';

export function PurchasesScreen({purchases,onAdd,onCustomer}:{purchases:Purchase[];onAdd:()=>void;onCustomer:(id:string)=>void}){
  const [search,setSearch]=useState('');const {width}=useWindowDimensions();const table=width>=920;
  const q=search.toLowerCase().trim();const filtered=[...purchases].filter(p=>p.perfumeName.toLowerCase().includes(q)||(p.customer?.name||'').toLowerCase().includes(q)||p.noteIds.some(id=>noteLabel(id).includes(q)))
    .sort((a,b)=>b.purchasedAt.localeCompare(a.purchasedAt));
  return <View style={{gap:17}}>
    <View style={{flexDirection:'row-reverse',alignItems:'center',flexWrap:'wrap',gap:12}}>
      <View style={{flex:1,minWidth:245}}><ScreenHeading eyebrow="PURCHASES / HISTORY" title="المشتريات" description="كل العمليات المسجلة وتقييماتها، مرتبطة بملفات العملاء." icon="▤"/></View>
      <Button title="＋ شراء جديد" onPress={onAdd}/>
    </View>
    <View style={{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}>
      <TextInput value={search} onChangeText={setSearch} placeholder="اسم العميل، العطر أو النوتة..." placeholderTextColor={C.muted}
        style={{height:44,minWidth:210,flexGrow:1,maxWidth:460,borderRadius:11,backgroundColor:'#FFFDFC',borderColor:C.line,borderWidth:1,paddingHorizontal:13,fontFamily:FONT.regular,textAlign:'right',writingDirection:'rtl',color:C.ink,fontSize:12}}/>
      <AText size={10} color={C.muted}>{filtered.length} عملية</AText>
    </View>
    <Card style={{gap:10}}>
      <AText weight="bold" size={15}>سجل المشتريات</AText>
      {table?<View style={{flexDirection:'row-reverse',padding:12,borderRadius:9,backgroundColor:'#FBF2ED'}}>
        {['العميل','العطر','النوتة','التاريخ','التقييم'].map(x=><AText key={x} style={{flex:1}} color="#896D5A" weight="bold" size={10}>{x}</AText>)}
      </View>:null}
      {!filtered.length?<Empty text="لا توجد عمليات شراء مطابقة"/>:filtered.map(p=><Pressable key={p.id} onPress={()=>onCustomer(p.customerId)} style={{paddingVertical:table?13:15,borderBottomWidth:1,borderBottomColor:C.line,gap:8}}>
        {table?<View style={{flexDirection:'row-reverse',alignItems:'center',gap:5}}>
          <AText color={C.goldDeep} weight="bold" style={{flex:1}} size={10}>{p.customer?.name||'العميل'}</AText>
          <AText weight="bold" style={{flex:1}} size={11}>{p.perfumeName}</AText>
          <AText color={C.muted} style={{flex:1}} size={10}>{noteLabel(p.primaryNoteId)}</AText>
          <AText color={C.muted} style={{flex:1}} size={9}>{arDate(p.purchasedAt)}</AText>
          <View style={{flex:1}}><Stars rating={p.rating} size={13}/></View>
        </View>:<>
          <View style={{flexDirection:'row-reverse',justifyContent:'space-between',gap:8,alignItems:'center'}}>
            <AText weight="bold" size={13}>{p.perfumeName}</AText><Stars rating={p.rating} size={15}/>
          </View>
          <View style={{flexDirection:'row-reverse',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}>
            <AText size={10} color={C.goldDeep}>{p.customer?.name||'العميل'}</AText>
            <AText size={10} color={C.muted}>{arDate(p.purchasedAt)}</AText>
          </View>
          <AText size={10} color={C.muted}>النوتة الرئيسية: {noteLabel(p.primaryNoteId)}</AText>
          <View style={{flexDirection:'row-reverse',flexWrap:'wrap',gap:6}}>{p.noteIds.map(id=><NoteTag key={id} id={id}/>)}</View>
        </>}
      </Pressable>)}
    </Card>
  </View>;
}
