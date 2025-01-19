export interface Page {
  title: string;
  url: string;
  icon: string;
  roles: string[];
}

export interface User {
  id: number;
  login: string;
  password: string;
  reset_password: boolean;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
}
