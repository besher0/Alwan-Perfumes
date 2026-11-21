import { Customer, CustomerAnalytics, DashboardData, NewPurchaseDto, Note, Purchase } from './types';

export const API_BASE=(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/,'');
export class ApiError extends Error { constructor(public status:number,message:string){super(message);this.name='ApiError';} }

async function request<T>(path:string, token:string|undefined, method='GET', body?:unknown):Promise<T>{
  let response:Response;
  try {
    response=await fetch(`${API_BASE}${path}`,{
      method,headers:{'Accept':'application/json',...(body!==undefined?{'Content-Type':'application/json'}:{}),...(token?{'Authorization':`Bearer ${token}`}:{})},
      ...(body!==undefined?{body:JSON.stringify(body)}:{}),
    });
  } catch {
    throw new ApiError(0,'تعذر الاتصال بالخادم. تأكد من عنوان API وأن الجهاز متصل بالشبكة.');
  }
  const data=await response.json().catch(()=>null);
  if(!response.ok){
    const raw=data?.message;
    const message=Array.isArray(raw)?raw.join('، '):typeof raw==='string'?raw:'حدث خطأ أثناء معالجة الطلب';
    throw new ApiError(response.status,message);
  }
  return data as T;
}

export const api={
  login:(username:string,password:string)=>request<{accessToken:string;owner:{id:string;username:string}}>('/auth/login',undefined,'POST',{username,password}),
  notes:(token:string)=>request<Note[]>('/notes',token),
  dashboard:(token:string)=>request<DashboardData>('/dashboard',token),
  customers:(token:string,search='')=>request<Customer[]>(`/customers${search?'?search='+encodeURIComponent(search):''}`,token),
  customer:(token:string,id:string)=>request<Customer>(`/customers/${id}`,token),
  createCustomer:(token:string,input:{name:string;phone:string;favoriteNoteIds:string[]})=>request<Customer>('/customers',token,'POST',input),
  updateFavorites:(token:string,id:string,noteIds:string[])=>request<Customer>(`/customers/${id}/favorites`,token,'PATCH',{noteIds}),
  purchases:(token:string)=>request<Purchase[]>('/purchases',token),
  createPurchase:(token:string,input:NewPurchaseDto)=>request<Purchase>('/purchases',token,'POST',input),
  analytics:(token:string,id:string)=>request<CustomerAnalytics>(`/customers/${id}/analytics`,token),
  share:(token:string,id:string)=>request<{phone:string;message:string}>(`/customers/${id}/share-summary`,token),
};
