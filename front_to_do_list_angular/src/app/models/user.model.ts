export interface User {
  name:string | undefined;
  lastname:string | undefined;
  username:string | undefined;
  email:string;
  role_id:number;
  phone:string | undefined;
  avatar_url:string | undefined;
}


export interface UserResponse {
  message: string;
  user: User;
}