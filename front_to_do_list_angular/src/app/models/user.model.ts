import { environment } from '../../enviroments/enviroment';

export interface User {
  user_id:string;
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

export function getAvatarUrl(filename: string | null): string | null {

    return filename
        ? `${environment.apiUrl}/uploads/avatars/${filename}`
        : null;

}