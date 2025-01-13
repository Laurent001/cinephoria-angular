export interface HelloResponse {
  message: string;
}

export interface UsersResponse {
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

export interface FilmsResponse {
  id: number;
  title: string;
  description: string;
  release_date: Date;
  age_minimum: number;
  favorite: number;
  poster: string;
}
