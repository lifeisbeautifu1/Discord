type User = {
  id: string;
  email: string;
  username: string;
  imageUrl: string | null;
} | null;

type Errors = {
  email?: string;
  username?: string;
  password?: string;
} | null;

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  username: string;
  password: string;
};
