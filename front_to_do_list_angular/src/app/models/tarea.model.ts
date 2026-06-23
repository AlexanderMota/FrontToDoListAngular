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
*/export interface Tarea {

  task_id?: string | number; //Esto debe ser string. Number solo para la data dumi en pruebas. Lo mismo con parent_task_id.
  
  name: string;

  description: string;

  status:
    | 'pending'
    | 'in-progress'
    | 'completed'
    | 'cancelled';

  priority:
    | 'low'
    | 'normal'
    | 'medium'
    | 'high'
    | 'critical';

  created_at: Date | undefined;

  updated_at: Date | undefined;

  parent_task_id?: string | number;
}