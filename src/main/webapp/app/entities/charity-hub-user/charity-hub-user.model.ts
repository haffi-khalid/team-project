export interface ICharityHubUser {
  id: number;
  username?: string | null;
  email?: string | null;
}

export type NewCharityHubUser = Omit<ICharityHubUser, 'id'> & { id: null };
