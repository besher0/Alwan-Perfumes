import React, {useState} from 'react';
import { ActivityIndicator, Image, Pressable, StyleProp, Text, TextInput, TextStyle, View, ViewStyle, useWindowDimensions } from 'react-native';
import { C, FONT } from '../theme/colors';
import { NOTE_IMAGES, noteLabel } from '../lib/notes';

export function AText({ children, weight='regular', size=14, color=C.ink, style, numberOfLines }: {
  children?:React.ReactNode;weight?:'regular'|'bold'|'extra';size?:number;color?:string;style?:StyleProp<TextStyle>;numberOfLines?:number;
}) {
  return <Text numberOfLines={numberOfLines} style={[{fontFamily:FONT[weight],fontSize:size,color,writingDirection:'rtl',textAlign:'right',lineHeight:size*1.85},style]}>{children}</Text>;
}

export function Card({children,style,padded=true}:{children:React.ReactNode;style?:StyleProp<ViewStyle>;padded?:boolean}){
  const {width}=useWindowDimensions();
  return <View style={[{backgroundColor:C.paper,borderColor:C.line,borderWidth:1,borderRadius:18,padding:padded?(width<480?14:18):0,overflow:'hidden'},style]}>{children}</View>;
}

export function Button({title,onPress,variant='gold',disabled=false,loading=false,style}:{title:string;onPress:()=>void;variant?:'gold'|'outline'|'light'|'danger';disabled?:boolean;loading?:boolean;style?:StyleProp<ViewStyle>}) {
  const bg=variant==='gold'?C.goldDeep:variant==='danger'?C.error:variant==='light'?C.goldLight:'transparent';
  const fg=variant==='gold'||variant==='danger'?C.white:C.goldDeep;
  return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled||loading} onPress={onPress}
    style={({pressed})=>[{minHeight:46,borderRadius:13,paddingHorizontal:18,paddingVertical:10,backgroundColor:bg,borderColor:variant==='outline'?C.goldLight:bg,borderWidth:1,alignItems:'center',justifyContent:'center',opacity:disabled ? 0.55 : pressed ? 0.75 : 1},style]}>
      {loading?<ActivityIndicator color={fg}/>:<AText color={fg} weight="bold" size={12} style={{textAlign:'center'}}>{title}</AText>}
  </Pressable>;
}

export function Field({label,value,onChangeText,placeholder,keyboardType='default',secure=false,editable=true,style}: {
  label:string;value:string;onChangeText?:(v:string)=>void;placeholder?:string;keyboardType?:'default'|'phone-pad'|'number-pad'|'email-address';secure?:boolean;editable?:boolean;style?:StyleProp<ViewStyle>;
}) {
 return <View style={[{minWidth:0,flexGrow:1,flexShrink:1,gap:6},style]}>
    <AText size={11} weight="bold" color={C.ink}>{label}</AText>
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#B1A198" keyboardType={keyboardType} secureTextEntry={secure} editable={editable}
      autoCapitalize="none" style={{height:46,borderWidth:1,borderColor:C.line,backgroundColor:C.white,borderRadius:12,paddingHorizontal:13,fontSize:12,fontFamily:FONT.regular,color:C.ink,textAlign:'right',writingDirection:'rtl',opacity:editable?1:.65}}/>
  </View>;
}

export function SectionHeading({title,description,icon}:{title:string;description?:string;icon?:string}) {
  const {width}=useWindowDimensions();
  return <View style={{gap:4,marginBottom:width<480?12:15}}>
    <View style={{flexDirection:'row-reverse',alignItems:'center',gap:8}}>
      {icon?<AText size={18} color={C.gold}>{icon}</AText>:null}
      <AText weight="bold" size={width<710?13:15} style={{lineHeight:width<710?22:26}}>{title}</AText>
    </View>
    {description?<AText size={10} color={C.muted}>{description}</AText>:null}
  </View>;
}

export function ScreenHeading({eyebrow,title,description,icon='✧'}:{eyebrow:string;title:string;description:string;icon?:string}) {
  const {width}=useWindowDimensions();
  const titleSize=width<=400?21:width<=710?22:width<950?24:27;
  return <View style={{flexDirection:'row-reverse',alignItems:'center',gap:width<480?9:13,marginBottom:4,marginTop:5}}>
    <View style={{width:width<480?40:47,height:width<480?40:47,borderRadius:13,backgroundColor:'#F1E8DF',alignItems:'center',justifyContent:'center'}}>
      <AText color={C.gold} size={22} style={{textAlign:'center'}}>{icon}</AText>
    </View>
    <View style={{flex:1,gap:2}}>
      <AText weight="bold" size={10} color={C.gold} style={{letterSpacing:1.3,textAlign:'right'}}>{eyebrow}</AText>
      <AText weight="extra" size={titleSize} style={{lineHeight:titleSize*1.6}}>{title}</AText>
      <AText color={C.muted} size={11}>{description}</AText>
    </View>
  </View>;
}

export function Stars({rating,onChange,size=24}:{rating:number;onChange?:(v:number)=>void;size?:number}) {
  return <View style={{flexDirection:'row-reverse',justifyContent:'flex-end',alignItems:'center',gap:3}}>
    {Array.from({length:5},(_,i)=>i+1).map(n=><Pressable key={n} disabled={!onChange} onPress={()=>onChange?.(n)} accessibilityRole="button" accessibilityLabel={`تقييم ${n} نجوم`} hitSlop={6}>
      <Text style={{fontSize:size,color:n<=rating?C.gold:'#D7CAC0'}}>★</Text>
    </Pressable>)}
  </View>;
}

/**
 * Note cards mirror the accepted HTML reference: 5 columns on wide panels,
 * 3 on phones and 2 on the narrowest devices. Measurements are taken from
 * the actual Card's inner width, not the screen width/sidebar estimate.
 */
export function NoteGrid({notes,selectedIds,onToggle,compact=false}:{
  notes:ReadonlyArray<{id:string}>;
  selectedIds:ReadonlyArray<string>;
  onToggle:(id:string)=>void;
  compact?:boolean;
}){
  const {width:screenWidth}=useWindowDimensions();
  const [measuredWidth,setMeasuredWidth]=useState(0);
  const available=measuredWidth||Math.max(220,screenWidth-(screenWidth>=820?326:80));
  const gap=available<440?7:compact?9:10;
  const minimum=compact?89:94; // 3 balanced notes on ~360px phones, 2 on narrow devices
  const columns=Math.max(2,Math.min(compact?6:5,Math.floor((available+gap)/(minimum+gap))));
  const tileWidth=Math.max(0,Math.floor((available-gap*(columns-1))/columns));
  return <View
    onLayout={e=>{
      const next=Math.round(e.nativeEvent.layout.width);
      if(next>0&&next!==measuredWidth)setMeasuredWidth(next);
    }}
    style={{width:'100%',flexDirection:'row-reverse',flexWrap:'wrap',columnGap:gap,rowGap:gap,alignItems:'stretch'}}
  >
    {notes.map(note=><NoteTile
      key={note.id} id={note.id} width={tileWidth} compact={compact}
      selected={selectedIds.includes(note.id)} onPress={()=>onToggle(note.id)}
    />)}
  </View>;
}

export function NoteTile({id,selected=false,onPress,width=112,disabled=false,compact=false}:{id:string;selected?:boolean;onPress?:()=>void;width?:number;disabled?:boolean;compact?:boolean}){
  const small=width<113;
  const imageHeight=compact?(small?54:66):(small?63:76);
  const fontSize=small?10:compact?11:12;
  return <Pressable
    disabled={disabled||!onPress}
    onPress={onPress}
    accessibilityRole="checkbox"
    accessibilityLabel={noteLabel(id)}
    accessibilityState={{checked:selected}}
    style={({pressed})=>({
      width,minWidth:0,minHeight:compact?(small?100:112):(small?112:124),
      backgroundColor:selected?'#FDF3F0':'#FFFAF6',
      borderColor:selected?'#A56D6E':'#E6D8CD',borderWidth:selected?1.6:1,
      borderRadius:13,paddingHorizontal:small?5:8,paddingTop:small?6:9,
      paddingBottom:compact?8:10,gap:4,
      alignItems:'center',justifyContent:'flex-end',
      opacity:pressed?0.84:1,position:'relative',
    })}
  >
    <Image
      source={NOTE_IMAGES[id]||NOTE_IMAGES.rose}
      style={{width:'100%',maxWidth:compact?105:110,height:imageHeight}}
      resizeMode="contain"
      accessible={false}
    />
    <AText
      weight="bold" size={fontSize}
      numberOfLines={1}
      style={{textAlign:'center',lineHeight:fontSize*1.65,width:'100%'}}
    >{noteLabel(id)}</AText>
    {selected?<View style={{
      position:'absolute',top:6,right:6,width:19,height:19,borderRadius:10,
      backgroundColor:C.rose,alignItems:'center',justifyContent:'center',
      borderColor:C.white,borderWidth:1,
    }}><Text style={{color:C.white,fontSize:11,fontWeight:'bold',lineHeight:15}}>✓</Text></View>:null}
  </Pressable>;
}

export function NoteTag({id}:{id:string}){
  return <View style={{
    flexDirection:'row-reverse',alignItems:'center',gap:7,
    borderColor:'#E6D8CE',borderWidth:1,backgroundColor:'#FFFAF7',
    borderRadius:10,paddingVertical:3,paddingHorizontal:8,minHeight:37,
  }}>
    <Image source={NOTE_IMAGES[id]||NOTE_IMAGES.rose} resizeMode="contain" style={{width:31,height:30}} accessible={false}/>
    <AText weight="bold" size={10} color="#795B46" style={{lineHeight:17}}>{noteLabel(id)}</AText>
  </View>;
}

export function Empty({text}:{text:string}){
  return <View style={{paddingVertical:35,alignItems:'center',justifyContent:'center'}}><AText color={C.muted} size={12} style={{textAlign:'center'}}>{text}</AText></View>;
}
export function ErrorText({message}:{message?:string|null}){
  if(!message)return null;
  return <View style={{backgroundColor:'#FFF0EF',padding:11,borderRadius:10,borderWidth:1,borderColor:'#EDCFCC'}}><AText size={11} color={C.error}>{message}</AText></View>;
}
