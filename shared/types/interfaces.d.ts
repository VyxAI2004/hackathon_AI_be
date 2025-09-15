export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskList {
  id: string;
  name: string;
  description?: string;
  created_by: string; 
  created_at: Date;
  updated_at: Date;
}

export interface UserTaskList {
  id: string;
  user_id: string;
  task_list_id: string;
  permission: 'view' | 'edit' | 'owner'|string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done' | string;
  priority: 'low' | 'medium' | 'high' | string;
  due_date?: Date;
  task_list_id?: string;
  created_by: string;
  assignedUsers?: User[];// Đã cập nhật để phản ánh mối quan hệ nhiều-nhiều
  created_at: Date;
  updated_at: Date;

}

export interface Comment {
  id: string;
  content: string;
  task_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskTag {
  id: string;
  task_id: string;
  tag_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  target_id?: string;
  target_type?: string;
  log_metadata?: Record<string, any>; 
  created_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: Date;
}

export interface Attachment {
  id: string;
  task_id: string;
  filename: string;
  url: string;
  filetype: string;
  filesize: number;
  uploaded_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface SubTask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CalendarEvent {
  id: string;
  task_id?: string;
  title: string;
  start: Date;
  end?: Date;
  all_day: boolean;
}
