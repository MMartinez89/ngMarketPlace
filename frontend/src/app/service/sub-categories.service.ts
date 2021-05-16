import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService {

  fireBase = environment.fireBase;
  constructor(private http: HttpClient) { }

  getFilterData(orderBy:string, equalTo:any){
    return this.http.get(`${this.fireBase}sub-categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);
  }
  patchData(id:String, value:Object){
    return this.http.patch(`${this.fireBase}sub-categories/${id}.json`, value);
  }
}
