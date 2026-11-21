export function purchaseOutput(p: {
  id: string;
  customerId: string;
  perfumeName: string;
  purchasedAt: Date;
  rating: number;
  primaryNoteId: string;
  createdAt: Date;
  notes: { noteId: string }[];
  customer?: { id: string; name: string; phone: string };
}) {
  return {
    id: p.id, customerId: p.customerId, perfumeName: p.perfumeName,
    purchasedAt: p.purchasedAt.toISOString().slice(0, 10), rating: p.rating,
    primaryNoteId: p.primaryNoteId, noteIds: p.notes.map(n => n.noteId),
    createdAt: p.createdAt.toISOString(),
    ...(p.customer ? { customer: p.customer } : {}),
  };
}
