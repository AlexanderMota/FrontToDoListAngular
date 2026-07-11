export interface Comment {
  user_id:string;
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

export interface CommentTree {
  comment: Comment;
  replies: CommentTree[];
}

export function buildTree(comments: Comment[]): CommentTree[] {

    const map = new Map<number, CommentTree>();

    const roots: CommentTree[] = [];

    // Crear todos los nodos
    comments.forEach(comment => {

      map.set(comment.comment_id, {
        comment,
        replies: []
      });

    });

    // Relacionar hijos con padres
    comments.forEach(comment => {

      const node = map.get(comment.comment_id)!;

      if (comment.parent_comment_id == null) {

        roots.push(node);

        return;

      }

      const parent = map.get(comment.parent_comment_id);

      if (parent) {

        parent.replies.push(node);

      } else {

        // Si el padre no existe, lo mostramos como raíz
        roots.push(node);

      }

    });

    return roots;

  }