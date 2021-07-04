# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Pasos para crear una aplicacion en Setting de FireBase 
    https://firebase.google.com/docs/web/setup
    1. CREAR UNA NUEVA APLICACION EN SETTING DE FIREBASE
    2.npm install --save firebase
    3. AGREGAR import firebase from "firebase/app" ;
    4. AGREGAR import "firebase/auth";

## URL para autenticarte desde facebook en fire base
    //https://firebase.google.com/docs/auth/web/facebook-login

## URL para autenticare desde google en fire base
    https://firebase.google.com/docs/auth/web/google-signin

## Iniciar angular con https 
ng serve --ssl

## Dependencia de data table
npm i angular-datatables
npm i @types/datatables.net --save-dev

## Subject
Genera un observable(espera a que toda se carge para luego con un tigger enviarle la data a data table)
ej:
1. DOM
2. Data en el DOM 
3. Data table 
4. Data en Data table

## Trigger
Almacena la data de los productos para luego enviarsela a data table

## plice()
La funcion plice funciona para remover un dato de un array y en sus parametros se paso el indice y cuantas quiere remover despues del indice 
Ej:
array = [a,b,c]
if(b==b){
    array.splice(indice,1)
}
array[a,c]

## Confirmation popover
npm install --save angular-confirmation-popover

import {ConfirmationPopoverModule} from 'angular-confirmation-popover';

imports: [
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger'
    })
  ],

## Notie alert
Alerta para dispositivos moviles

npm install notie


