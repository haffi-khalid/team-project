export interface IAuthentication {
  id: number;
  isAuthenticated?: boolean | null;
}

export type NewAuthentication = Omit<IAuthentication, 'id'> & { id: null };
