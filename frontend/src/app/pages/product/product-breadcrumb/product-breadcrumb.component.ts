import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductsService} from '../../../service/products.service';

@Component({
  selector: 'app-product-breadcrumb',
  templateUrl: './product-breadcrumb.component.html',
  styleUrls: ['./product-breadcrumb.component.css']
})

export class ProductBreadcrumbComponent implements OnInit {
   breadcrum: string= ""
  constructor(private activatedRoute: ActivatedRoute, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.breadcrum =  this.activatedRoute.snapshot.params["param"].replace(/[-]/g," ");
    //ACTUALIZAMOS LAS VISTA DEL PRODUCTO
    this.productsService.getFilterData("url",this.activatedRoute.snapshot.params["param"]).subscribe((res:any)=>{
      for(const i in res){
        let id = Object.keys(res).toString();
        console.log(id);
        let value = {
          "views": Number(res[i].views+1)
        }
        this.productsService.pachData(id, value).subscribe((res:any)=>{

        });
      }
    });
  }

}
