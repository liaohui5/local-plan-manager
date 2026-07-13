export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Task {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  tags?: string[];
}
