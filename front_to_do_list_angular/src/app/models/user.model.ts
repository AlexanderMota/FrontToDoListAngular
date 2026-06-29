export interface User {
  name:string | null;
  lastname:string | null;
  username:string | null;
  email:string;
  role_id:number;
  phone:string | null;
  avatar_url:string | null;
}


export interface UserResponse {
  message: string;
  user: User;
}