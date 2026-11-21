import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleProp, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { C, FONT } from '../theme/colors';
import { NOTE_IMAGES, noteLabel } from '../lib/notes';

export function AText({children,weight='regular',size=14,color=C.ink,style,numberOfLines}: {
  children?:React.ReactNode;weight?:'regular'|'bold'|'extra';size?:number;color?:string;style?:StyleProp<TextStyle>;numberOfLines?:number;
}) {
  return <Text numberOfLines={numberOfLines} style={[{fontFamily:FONT[weight],fontSize:size,color,writingDirection:'rtl',textAlign:'right',lineHeight:size*1.85},style]}>{children}</Text>;
}

export function Card({children,style,padded=true}:{children:React.ReactNode;style?:StyleProp<ViewStyle>;padded?:boolean}){
  return <View style={[{backgroundColor:C.paper,borderColor:C.line,borderWidth:1,borderRadius:20,padding:padded?18:0,overflow:'hidden'},style]}>{children}</View>;
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
 return <View style={[{minWidth:0,flex:1,gap:6},style]}>
    <AText size={11} weight="bold" color={C.ink}>{label}</AText>
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#B1A198" keyboardType={keyboardType} secureTextEntry={secure} editable={editable}
      autoCapitalize="none" style={{height:46,borderWidth:1,borderColor:C.line,backgroundColor:C.white,borderRadius:12,paddingHorizontal:13,fontSize:12,fontFamily:FONT.regular,color:C.ink,textAlign:'right',writingDirection:'rtl',opacity:editable?1:.65}}/>
  </View>;
}

export function SectionHeading({title,description}:{title:string;description?:string}) {
 return <View style={{gap:2,marginBottom:14}}><AText weight="bold" size={15}>{title}</AText>{description?<AText size={10} color={C.muted}>{description}</AText>:null}</View>;
}

export function ScreenHeading({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
 return <View style={{marginBottom:20,marginTop:3,gap:3}}>
   <AText weight="bold" size={10} color={C.gold} style={{letterSpacing:1}}>{eyebrow}</AText>
   <AText weight="extra" size={27}>{title}</AText>
   <AText color={C.muted} size={11}>{description}</AText>
 </View>;
}

export function Stars({rating,onChange,size=24}:{rating:number;onChange?:(v:number)=>void;size?:number}) {
 return <View style={{flexDirection:'row-reverse',justifyContent:'flex-end',alignItems:'center',gap:3}}>
 {Array.from({length:5},(_,i)=>i+1).map(n=><Pressable key={n} disabled={!onChange} onPress={()=>onChange?.(n)} accessibilityRole="button" accessibilityLabel={`تقييم ${n} نجوم`} hitSlop={6}>
 <Text style={{fontSize:size,color:n<=rating?C.gold:'#D7CAC0'}}>★</Text>
 </Pressable>)}
 </View>;
}

export function NoteTile({id,selected=false,onPress,width=112,disabled=false}:{id:string;selected?:boolean;onPress?:()=>void;width?:number;disabled?:boolean}){
 return <Pressable disabled={disabled||!onPress} onPress={onPress} accessibilityRole="checkbox" accessibilityState={{checked:selected}}
   style={({pressed})=>({width,backgroundColor:selected?C.roseLight:'#F9F5F1',borderColor:selected?C.rose:C.line,borderWidth:selected?1.5:1,borderRadius:15,padding:7,alignItems:'center',opacity:pressed ? 0.8 : 1,position:'relative'})}>
   <Image source={NOTE_IMAGES[id]||NOTE_IMAGES.rose} style={{width:'100%',height:76,borderRadius:10}} resizeMode="cover" />
   <AText weight="bold" size={11} style={{textAlign:'center',marginTop:5}}>{noteLabel(id)}</AText>
   {selected?<View style={{position:'absolute',top:5,right:5,width:22,height:22,borderRadius:11,backgroundColor:C.rose,alignItems:'center',justifyContent:'center',borderColor:C.white,borderWidth:1}}><Text style={{color:C.white,fontSize:13,fontWeight:'bold'}}>✓</Text></View>:null}
 </Pressable>;
}

export function NoteTag({id}:{id:string}){
 return <View style={{flexDirection:'row-reverse',alignItems:'center',gap:6,borderColor:C.line,borderWidth:1,backgroundColor:C.white,borderRadius:20,padding:5,paddingHorizontal:9}}>
 <Image source={NOTE_IMAGES[id]||NOTE_IMAGES.rose} style={{width:25,height:25,borderRadius:13}} />
 <AText weight="bold" size={10}>{noteLabel(id)}</AText>
 </View>;
}

export function Empty({text}:{text:string}){
 return <Card style={{paddingVertical:42,alignItems:'center'}}><AText color={C.muted} size={13} style={{textAlign:'center'}}>{text}</AText></Card>;
}

export function ErrorText({message}:{message?:string|null}){
 if(!message)return null;
 return <View style={{backgroundColor:'#FFF0EF',padding:11,borderRadius:10,borderWidth:1,borderColor:'#EDCFCC'}}><AText size={11} color={C.error}>{message}</AText></View>;
}
