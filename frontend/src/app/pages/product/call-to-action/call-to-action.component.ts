import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsService} from '../../../service/products.service';

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {

  call_to_action: Array<any> = [];
  price: Array<any>=[];
  constructor(private activatedRoute:  ActivatedRoute, private productsService: ProductsService) { }

  ngOnInit(): void {
    let params = this.activatedRoute.snapshot.params["param"];
    this.productsService.getSearchData("url", params).subscribe((res:any)=>{
      for(let i in res){
        this.call_to_action.push(res[i]);
        this.call_to_action.forEach((response:any)=>{
          let type;
          let value;
          let offer;

          if(response.offer !=""){
            type=JSON.parse(response.offer)[0];
            value = JSON.parse(response.offer)[1];
            offer = (response.price - (response.price * (value/100))).toFixed(2);
            if(type == "Disscount"){
              offer = (response.price - (response.price * (value/100))).toFixed(2);
            }
            if(type == "Fixed"){
              offer = value;
            }
            this.price.push(  ` <span class="ps-product__price">
                                  <span>$${offer}</span>
                                  <del>$${response.price}</del>
                                </span>`)
            
          }else{
            this.price.push(  ` <span class="ps-product__price">
                                  <span>$${response.price}</span>
                                </span>`)
          }
        });
      }   
    });
  
  
  }

}
