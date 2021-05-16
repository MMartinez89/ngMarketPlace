import { Injectable } from '@angular/core';
import {HttpClient}  from '@angular/common/http';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StoresService {

  fireBase: string = environment.fireBase;
  constructor(private http: HttpClient) { 
    
  }

  getData(){
    return this.http.get(`${this.fireBase}stores.json`);
  }

  getFilterData(orderBy:string, equalTo:string){
    return this.http.get(`${this.fireBase}stores.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`)
  }
}
