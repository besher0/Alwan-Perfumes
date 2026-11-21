export type Page = 'dashboard'|'customers'|'purchases'|'newPurchase'|'profile'|'insights';
export type NoteId = 'rose'|'vanilla'|'oud'|'musk'|'citrus'|'wood'|'amber'|'jasmine'|'lavender';
export type Note = { id:string; nameAr:string; sortOrder:number };
export type Customer = { id:string; name:string; phone:string; createdAt:string; purchaseCount?:number; favoriteNoteIds:string[]; purchases?:Purchase[] };
export type Purchase = { id:string; customerId:string; perfumeName:string; purchasedAt:string; rating:number; primaryNoteId:string; noteIds:string[]; createdAt:string; customer?:{id:string;name:string;phone:string} };
export type CustomerAnalytics = {
  customerId:string; purchaseCount:number; averageRating:number; favoriteNoteIds:string[];
  mostLiked:NoteStat[]; mostPurchased:NoteStat[];
};
export type NoteStat = { noteId:string; name:string; count:number; avgRating:number };
export type DashboardData = { customersCount:number; purchasesCount:number; averageRating:number; recentPurchases:Purchase[] };
export type NewPurchaseDto = { customerId:string; perfumeName:string; purchasedAt:string; rating:number; primaryNoteId:string; noteIds:string[]; favoriteNoteIds?:string[] };
