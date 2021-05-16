import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ProductsService {

   private fireBase:string = environment.fireBase;

  constructor(private http: HttpClient) { 

  }

  getData(){
    return this.http.get(`${this.fireBase}products.json`);
  } 

  getLimit(startAt: string, limitToFirst:number){
    return this.http.get(`${this.fireBase}products.json?orderBy="$key"&startAt="${startAt}"&limitToFirst=${limitToFirst}&print=pretty`)
  }

  getFilterData(orderBy: string, equalTo:string){
    return this.http.get(`${this.fireBase}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);
   //return this.http.get(`${this.fireBase}products.json?orderBy="name"&equalTo="Marshall Kilburn Portable Wireless"&print=pretty`);
  }

  getFilterDataWithLimit(orderBy:string, equalTo: string,  limitToFirst:number){
    return this.http.get(`${this.fireBase}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&limitToFirst=${limitToFirst}&print=pretty'`)
  }

  getSearchData(orderBy: string, param:string){
    return this.http.get(`${this.fireBase}products.json?orderBy="${orderBy}"&startAt="${param}"&endAt="${param}\uf8ff"&print=pretty'`);
  }
  pachData(id:String, value:Object){
    return this.http.patch(`${this.fireBase}products/${id}.json`,value)
  }

  }

 


