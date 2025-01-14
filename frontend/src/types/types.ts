export interface User {
    _id: string;
    username: string;
    email: string;
  }
  
  export interface UserCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends UserCredentials {
    username: string;
  }