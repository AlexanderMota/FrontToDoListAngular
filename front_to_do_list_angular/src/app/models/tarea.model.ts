/*export interface Tarea {
   task_id?: string | number; //Esto debe ser string. Number solo para la data dumi en pruebas
  name: string;
  description: string;
  status: string;
  priority: string;
  created_at: Date | undefined;
  updated_at: Date | undefined;
  parent_task_id?: string;
}
*/
export type TaskPriority =
  | 'very_low'
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export type TaskStatus =
  | 'pending'
  | 'done'
  | 'inprogress'
  | 'paused'
  | 'canceled';

export interface Tarea {

  task_id?: string | number; //Esto debe ser string. Number solo para la data dumi en pruebas. Lo mismo con parent_task_id.
  
  name: string;

  description: string;

  status: TaskStatus;

  priority: TaskPriority;

  created_at: Date | null;

  updated_at: Date | null;

  parent_task_id?: string | number;
  
}

export interface TareaResponse {
  message: string;
  tarea: Tarea | null;
  tareas: Tarea[] | null;
  options: string[] | null;
}

export const PRIORITIES: {
  value: TaskPriority;
  label: string;
}[] = [

  { value: 'very_low', label: 'Leve' },
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Crítica' }

];

export const STATUS: {
  value: TaskStatus;
  label: string;
}[] = [

  { value: 'pending', label: 'Pendiente' },
  { value: 'done', label: 'Completada' },
  { value: 'inprogress', label: 'Progresando' },
  { value: 'paused', label: 'Pausada' },
  { value: 'canceled', label: 'Cancelada' }

];

export function getPriorityLabel(
  value: TaskPriority
): string {

  return PRIORITIES.find(
    p => p.value === value
  )?.label ?? value;

}


export function getStatusLabel(
  value: TaskStatus
): string {

  return STATUS.find(
    s => s.value === value
  )?.label ?? value;

}