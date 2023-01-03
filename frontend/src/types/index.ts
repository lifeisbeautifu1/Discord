export type User = {
  id: string;
  email: string;
  username: string;
  imageUrl: string | null;
} | null;

export type Errors = {
  email?: string;
  username?: string;
  password?: string;
} | null;

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  username: string;
  password: string;
};
