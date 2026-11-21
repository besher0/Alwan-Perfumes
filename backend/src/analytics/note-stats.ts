export type PurchaseForStats = {rating: number; notes: {noteId: string}[]};
export type NoteForStats = {id: string; nameAr: string; sortOrder: number};

/** Each note receives the rating of each purchase containing it exactly once. */
export function calculateNoteStats(purchases: PurchaseForStats[], notes: NoteForStats[]) {
  return notes.map(note => {
    const matches = purchases.filter(p => p.notes.some(n => n.noteId === note.id));
    const count = matches.length;
    const avgRating = count ? Math.round(matches.reduce((sum,p)=>sum+p.rating,0)/count*10)/10 : 0;
    return { noteId: note.id, name: note.nameAr, count, avgRating };
  }).filter(n=>n.count>0);
}
