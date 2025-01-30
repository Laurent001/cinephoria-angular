import { User } from '../app';

export interface Login {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}
