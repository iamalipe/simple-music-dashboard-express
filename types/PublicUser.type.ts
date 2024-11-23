// export type PublicUser = Omit<User, 'password'>;
export type PublicUser = {
  id: string;
  email: string;
};
