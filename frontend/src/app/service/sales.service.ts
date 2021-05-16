import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient}  from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  fireBase = environment.fireBase;
  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get(`${this.fireBase}/sales.json`);
  }
}
