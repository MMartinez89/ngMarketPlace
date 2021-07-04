import { Component, OnInit, Input, OnDestroy } from '@angular/core'; 
import {UsersService} from '../../../../service/users.service';
import {ProductsService} from '../../../../service/products.service';
import {DinamicPrice, SweetAlert} from '../../../../function';
import {Subject,} from 'rxjs';
//@ts-ignore
import notie from 'notie';
//@ts-ignore
import {confirm} from 'notie'

declare var JQuery: any;
declare var $: any;

@Component({
  selector: 'app-account-wishlist',
  templateUrl: './account-wishlist.component.html',
  styleUrls: ['./account-wishlist.component.css']
})
export class AccountWishlistComponent implements OnInit, OnDestroy {

@Input() childItem:any
wishList:any[] = [];
products: any[] = [];
price: any[] = [];
stock:any[] = [];
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();
render:boolean = true;
popoverMessage: string = "Are you sure to remove it?";

  constructor(private usersService: UsersService, private productsService: ProductsService) { }

  ngOnInit(): void {
    //Agregamos lsa opciones de Data Tables
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true
    };
    this.usersService.getUniqueData(this.childItem).subscribe((res:any)=>{
      if(res["wishList"] != undefined){
        //Tomamos de la data la lista de deseos
        this.wishList = JSON.parse(res["wishList"]);
        let load = 0;
        //Realizamos un foreach en la lista de deseos 
        if(this.wishList.length > 0){
      
          this.wishList.forEach((list:any)=>{
          
            this.productsService.getFilterData("url",list).subscribe((res:any)=>{
              //Recorremos la data de productos
              for(const i in res){

                load ++;
                //Agregando los productos
                this.products.push(res[i]);
              
                //Validamos los preciosn en oferta
                this.price.push(DinamicPrice.fnc(res[i]));
                if(load == this.wishList.length){
                this.dtTrigger.next(); 
                }

              }
             
            });
        
          });
        }
      }
    });
  }

  //Removemos el producto de la lista de deseos
  removeProduct(product:any){

   //Bucamos la coincidencia para remover el producto
    this.wishList.forEach((list,index)=>{
      if(list === product){
        this.wishList.splice(index,1);
      }
    })

    //Actualizamos en fireBase
    let body={
      wishList: JSON.stringify(this.wishList)
    }
    this.usersService.patchData(this.childItem,body).subscribe((res:any)=>{
      if(res["wishList"] != ""){
        SweetAlert.fnc("success","Product remove","account");
      }
    });
  }

  callback(){
    if(this.render){
      this.render =  false;
      
      if(window.matchMedia("(max-width:991px)").matches){

      
        let localWishList = this.wishList;
        let localChildItem = this.childItem;
        let localUsersServive = this.usersService;

         $(document).on("click",".removeProduct", function(this:any){
           
          let product = $(this).attr("remove");

          notie.confirm({
          text: "Are you sure to remove it?",
          cancelCallback:function(){
            return;
          },
          submitCallback: function(){
            
            //Bucamos la coincidencia para remover el producto
             localWishList.forEach((list:any,index:any)=>{
               if(list === product){
                 localWishList.splice(index,1);
               }
             })
  
           //Actualizamos en fireBase
           let body={
             wishList: JSON.stringify(localWishList)
           }
           localUsersServive.patchData(localChildItem,body).subscribe((res:any)=>{
             if(res["wishList"] != ""){
               SweetAlert.fnc("success","Product remove","account");
             }
           });
          }
         })
        /* let product = $(this).attr("remove");

          //Bucamos la coincidencia para remover el producto
           localWishList.forEach((list:any,index:any)=>{
             if(list === product){
               localWishList.splice(index,1);
             }
           })

         //Actualizamos en fireBase
         let body={
           wishList: JSON.stringify(localWishList)
         }
         localUsersServive.patchData(localChildItem,body).subscribe((res:any)=>{
           if(res["wishList"] != ""){
             SweetAlert.fnc("success","Product remove","account");
           }
         });*/
        })
      }
    }
  }

  ngOnDestroy():void{
    this.dtTrigger.unsubscribe();
  }

 /* loadProducts(wishlistIDs:string[]) {
    
    let listProductsRequests:any= {};

    for(let i:number=0; i < wishlistIDs.length; ++i) {

      let idWish= wishlistIDs[i];
      listProductsRequests[`reqProd${i}`]= this.productsService.getUniqueData(idWish);
    }

    console.log(listProductsRequests);

    forkJoin(listProductsRequests)
        .subscribe(response => {

          // products
          let keys= Object.keys(response);
          let producsResult: any[]= [];
          for(let i:number=0; i < keys.length; ++i) {
            let key:any= keys[i];
            producsResult.push(response[key]);
          }

          this.products= producsResult;
          this.dtTrigger.next();
        });
  }*/


}
