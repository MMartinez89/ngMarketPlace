export class UsersModel{
     first_name?:string;
     last_name?:string;
     displayName: string;
     username: string;
     email:string;
     password?:string;
     returnSecureToken?: boolean;
     method: string;
     picture?: string;
     idToken?: string;
     needConfrim?: boolean;
     country?:string;
     country_code?:string;
     city?:string;
     address?:string;
     phone?:string;
     constructor(){
        this.first_name = "",
        this.last_name = "",
        this.displayName = "",
        this.username = "",
        this.email = "";
        this.password = "";
        this.returnSecureToken = false
        this.method = ""
        this.picture = undefined,
        this.idToken = "",
        this.needConfrim = false,
        this.country = "",
        this.country_code = "",
        this.city = "",
        this.address = "",
        this.phone = ""
      }   


}