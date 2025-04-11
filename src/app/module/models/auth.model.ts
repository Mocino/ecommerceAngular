export interface User {
  name: string;
  email: string;
}

export interface AuthResponse {
  USER_FRONTED?: {
    token: string;
    user: User;
  };
  error?: {
    message: string;
  };
}
