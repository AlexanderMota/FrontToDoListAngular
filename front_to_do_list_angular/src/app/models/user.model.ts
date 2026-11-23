import { environment } from '../../environments/environment';
import { Task } from './tarea.model';
import { RequestTask } from './request_task.model';

export interface User {
  user_id:string;
  name:string | null;
  lastname:string | null;
  username:string;
  email:string;
  role:string;
  phone:string | null;
  avatar_url:string | null;
  password:string | null;
}


export interface UserResponse {
  message: string;
  user: User | null;
  users: User[] | null;
  collaborator : Collaborator | null;
  collaborators : Collaborator[] | null;
  invitation: Invitation | null;
}

//se debe eliminar
export interface Collaborator {
  user:User;
  request_task : RequestTask;
}

export interface Invitation {
  request_task:RequestTask,
  user:User;
  task:Task;
}



export function getAvatarUrl(filename: string | null): string | null {

    return filename
        ? `${environment.apiUrl}/uploads/avatars/${filename}`
        : null;

}