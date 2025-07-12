export type User = {
  id: string;
  email: string;
  userName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
};

export type RegisterRequest = {
  userName: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
