export interface Page {
  title: string;
  url: string;
  icon: string;
  roles: string[];
}

export interface User {
  id?: number;
  email: string;
  token?: string;
  password?: string;
  reset_password?: boolean;
  first_name: string;
  last_name: string;
  role: Role;
  created_at?: string;
}

export interface Role {
  id: number;
  name: string;
}
