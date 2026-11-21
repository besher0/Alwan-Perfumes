import { ImageSourcePropType } from 'react-native';
export const NOTE_IMAGES: Record<string,ImageSourcePropType>={
 rose:require('../assets/notes/rose.jpg'),vanilla:require('../assets/notes/vanilla.jpg'),
 oud:require('../assets/notes/oud.jpg'),musk:require('../assets/notes/musk.jpg'),
 citrus:require('../assets/notes/citrus.jpg'),wood:require('../assets/notes/wood.jpg'),
 amber:require('../assets/notes/amber.jpg'),jasmine:require('../assets/notes/jasmine.jpg'),
 lavender:require('../assets/notes/lavender.jpg'),
};
export const FALLBACK_NOTES=[
 {id:'rose',nameAr:'ورد',sortOrder:0}, {id:'vanilla',nameAr:'فانيلا',sortOrder:1},
 {id:'oud',nameAr:'عود',sortOrder:2}, {id:'musk',nameAr:'مسك',sortOrder:3},
 {id:'citrus',nameAr:'حمضيات',sortOrder:4}, {id:'wood',nameAr:'خشبي',sortOrder:5},
 {id:'amber',nameAr:'عنبر',sortOrder:6}, {id:'jasmine',nameAr:'ياسمين',sortOrder:7},
 {id:'lavender',nameAr:'لافندر',sortOrder:8},
];
export const noteLabel=(id:string)=>FALLBACK_NOTES.find(n=>n.id===id)?.nameAr||id;
export function today(){const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
export function arDate(date:string){return new Date(`${date}T12:00:00Z`).toLocaleDateString('ar-SY',{day:'numeric',month:'long',year:'numeric'});}
