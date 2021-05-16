import { Component, OnInit } from '@angular/core';
import {CategoriesService} from '../../../service/categories.service';
import {SubCategoriesService} from '../../../service/sub-categories.service'; 
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-products-breadcrumb',
  templateUrl: './products-breadcrumb.component.html',
  styleUrls: ['./products-breadcrumb.component.css']
})
export class ProductsBreadcrumbComponent implements OnInit {
 breadcrumb:string= "";
  constructor(private categoriesService: CategoriesService, private subCategoriesService: SubCategoriesService, private activatedRoute: ActivatedRoute  ) { }

  ngOnInit(): void {
    let params = this.activatedRoute.snapshot.params["param"].split("&")[0];
    //FILTRAR LA DATA DE CATEGORIAS
    this.subCategoriesService.getFilterData("url",params).subscribe((res:any)=>{
      if(Object.keys(res).length > 0){
        for(let i in res){
          this.breadcrumb =  res[i].name; 
          let id = Object.keys(res).toString();
            let value = {
              "view": Number(res[i].view+1)
            }
            this.subCategoriesService.patchData(id, value).subscribe((resp:any)=>{
              console.log("resp",resp);
            });
       }
      }else{
        this.categoriesService.getFilterData("url", params).subscribe((res1:any)=>{
          for(let i in res1){
            this.breadcrumb = res1[i].name;
            let id = Object.keys(res1).toString();
            let value = {
              "view": Number(res1[i].view+1)
            }
            this.categoriesService.patchData(id, value).subscribe((resp:any)=>{
              console.log("resp",resp);
            });
          }
        });
      }
    
    });
  }


}
