export interface ICharity {
  id: number;
  name?: string | null;
}

export type NewCharity = Omit<ICharity, 'id'> & { id: null };
