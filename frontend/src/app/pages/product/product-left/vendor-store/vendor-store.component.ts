import { Component, OnInit, Input } from '@angular/core';
import {StoresService} from '../../../../service/stores.service';

@Component({
  selector: 'app-vendor-store',
  templateUrl: './vendor-store.component.html',
  styleUrls: ['./vendor-store.component.css']
})
export class VendorStoreComponent implements OnInit {

  @Input() childItem:any;
  stores:any[]=[];
  constructor(private storesService: StoresService) { }

  ngOnInit(): void {
    this.storesService.getFilterData("store", this.childItem).subscribe((res:any)=>{
      for(let i in res){
        this.stores.push(res[i]);
      }
    });
  }

}
