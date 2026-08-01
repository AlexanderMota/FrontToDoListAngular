import { environment } from '../../enviroments/enviroment';
import { Task, TaskStatus } from './tarea.model';

export type RequestTaskStatus =
  | 'pending'
  | 'accepted'
  | 'declined';

export interface User {
  user_id:string;
  name:string | null;
  lastname:string | null;
  username:string;
  email:string;
  role_id:number;
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


export interface Collaborator {
  user:User;
  request_task : RequestTask;
}

export interface Invitation {
  request_task:RequestTask,
  user:User;
  task:Task;
}

export interface RequestTask {
  request_id: number,
  task_id: number,
  user_id: string,
  sender_user_id: string | null,
  status: RequestTaskStatus;
  created_at:  Date | null;
  updated_at:  Date | null;

}

export const STATUS: {
  value: RequestTaskStatus;
  label: string;
}[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'accepted', label: 'Aceptada' },
  { value: 'declined', label: 'Rechazada' }
];

export function getStatusLabel(
  value: RequestTaskStatus
): string {

  return STATUS.find(
    s => s.value === value
  )?.label ?? value;

}



export function getAvatarUrl(filename: string | null): string | null {

    return filename
        ? `${environment.apiUrl}/uploads/avatars/${filename}`
        : null;

}