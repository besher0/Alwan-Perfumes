import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {calculateNoteStats} from '../src/analytics/note-stats';

const notes=[
 {id:'rose',nameAr:'ورد',sortOrder:0},
 {id:'oud',nameAr:'عود',sortOrder:1},
 {id:'vanilla',nameAr:'فانيلا',sortOrder:2},
];

test('averages stars over purchases containing each note, not over total purchases',()=>{
 const stats=calculateNoteStats([
  {rating:5,notes:[{noteId:'rose'},{noteId:'oud'}]},
  {rating:3,notes:[{noteId:'rose'}]},
  {rating:1,notes:[{noteId:'oud'}]},
 ],notes);
 assert.deepEqual(stats.find(s=>s.noteId==='rose'),{noteId:'rose',name:'ورد',count:2,avgRating:4});
 assert.deepEqual(stats.find(s=>s.noteId==='oud'),{noteId:'oud',name:'عود',count:2,avgRating:3});
 assert.equal(stats.some(s=>s.noteId==='vanilla'),false);
});

test('no purchase means no note statistics',()=>{
 assert.deepEqual(calculateNoteStats([],notes),[]);
});
