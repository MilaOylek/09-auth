export type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
};

export type UpdateProfileRequest = {
  username?: string;
  email?: string;
  avatar?: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
