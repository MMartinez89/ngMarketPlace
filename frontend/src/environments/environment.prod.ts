export const environment = {
  production: true,
  fireBase: 'https://marketplace-5acdd-default-rtdb.firebaseio.com/',
  //registrode usuario en fireBase Authentication
  register:'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw',
  //ingreso de usuario en fireBase Authentication
  login: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw',
  //ENVIAR VERIFICACION POR CORREPO ELECTRONICO
  sendEmailVerification: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw',
  // VERIFICAR LA CONFIRMACION DE CORREO ELECTRONICO
  confirmEmailVerification: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw',
  //VERIFICAR LA DATA DEL USURIO
  getUserData: "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
  //ENVIAR CONTRASENA RESETEADA AL EMAIL
  sendPasswordResetEmail: "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
  //VERIFICAR EL CAMBIO DE LA CONTRASENA 
  verifyPasswordResetCode:"https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
  //ENVIAR NUEVA CONTRASENA
  confirmPasswordReset: "https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
  //Cambiar la contrasena
  changePassword: "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
   //Server
   Server: "http://localhost/ngMarketPlace/frontend/src/assets/img/index.php?key=AIzaSyAwIu-uWRLt1gL_q1ajsSjoRPxQ0ck3RFw",
};
