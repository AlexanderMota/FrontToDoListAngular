export type RequestTaskStatus =
  | 'pending'
  | 'accepted'
  | 'declined';


  
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

