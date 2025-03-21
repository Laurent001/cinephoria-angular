export interface HelloResponse {
  message: string;
}

export interface UserResponse {
  id: number;
  login: string;
  password: string;
  reset_password: boolean;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role_id: number;
  created_at: string;
}
