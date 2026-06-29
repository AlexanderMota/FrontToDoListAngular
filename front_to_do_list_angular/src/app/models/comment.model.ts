export interface Comment {
  comment_id:number;
  task_id:string;
  username:string;
  avatar_url:string | null;
  content:string;
  created_at:Date | null;
  updated_at:Date | null;
  parent_comment_id:number | null;
}


export interface CommentResponse {
  message: string;
  comment: Comment | null;
  comments: Comment[] | null;
}