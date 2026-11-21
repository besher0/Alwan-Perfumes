import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/auth/password';

const db=new PrismaClient();
const notes=[
  {id:'rose',nameAr:'ورد'},
  {id:'vanilla',nameAr:'فانيلا'},
  {id:'oud',nameAr:'عود'},
  {id:'musk',nameAr:'مسك'},
  {id:'citrus',nameAr:'حمضيات'},
  {id:'wood',nameAr:'خشبي'},
  {id:'amber',nameAr:'عنبر'},
  {id:'jasmine',nameAr:'ياسمين'},
  {id:'lavender',nameAr:'لافندر'},
];
async function main(){
  for (const [i,n] of notes.entries()) await db.fragranceNote.upsert({where:{id:n.id},update:{nameAr:n.nameAr,sortOrder:i},create:{...n,sortOrder:i}});
  const username=process.env.OWNER_USERNAME;
  const password=process.env.OWNER_PASSWORD;
  if(!username||!password||password.startsWith('SET_')||password.length<12) throw new Error('OWNER_USERNAME and a strong OWNER_PASSWORD of at least 12 characters are required');
  await db.ownerUser.upsert({where:{username},update:{passwordHash:hashPassword(password)},create:{username,passwordHash:hashPassword(password)}});
  if(process.env.SEED_DEMO==='true'){
    const samples=[
      {name:'ليان الخطيب',phone:'963944238117',favorites:['lavender','jasmine','amber'],perfume:'عود ملكي',noteIds:['oud','rose','vanilla'],primary:'oud',rating:5,date:'2026-11-12'},
      {name:'راما النجار',phone:'963933782641',favorites:['rose','vanilla'],perfume:'ورد شرقي',noteIds:['rose','amber'],primary:'rose',rating:4,date:'2026-11-02'},
    ];
    for(const s of samples){
      const c=await db.customer.upsert({where:{phone:s.phone},update:{name:s.name},create:{name:s.name,phone:s.phone}});
      await db.customerFavoriteNote.deleteMany({where:{customerId:c.id}});
      await db.customerFavoriteNote.createMany({data:s.favorites.map(noteId=>({customerId:c.id,noteId}))});
      const exists=await db.purchase.findFirst({where:{customerId:c.id,perfumeName:s.perfume,purchasedAt:new Date(s.date+'T00:00:00Z')}});
      if(!exists) await db.purchase.create({data:{customerId:c.id,perfumeName:s.perfume,primaryNoteId:s.primary,purchasedAt:new Date(s.date+'T00:00:00Z'),rating:s.rating,notes:{create:s.noteIds.map(noteId=>({noteId}))}}});
    }
  }
  console.log('Seed completed; fragrance notes and owner account ready');
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>db.$disconnect());
