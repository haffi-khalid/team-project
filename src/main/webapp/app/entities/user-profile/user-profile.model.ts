export interface IUserProfile {
  id: number;
  userName?: string | null;
  role?: string | null;
}

export type NewUserProfile = Omit<IUserProfile, 'id'> & { id: null };
