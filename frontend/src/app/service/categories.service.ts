import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private fireBase: string = environment.fireBase;

  constructor(private http: HttpClient) { 

  }

  getData(){
    return this.http.get(`${this.fireBase}categories.json`);
  }

  getFilterData(orderBy:string, equalTo:String){
    return this.http.get(`${this.fireBase}categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&limitToFirst=6&print=pretty'`);
  }

  patchData(id: String, value: Object){
    return this.http.patch(`${this.fireBase}categories/${id}.json`,value);
  }
}
