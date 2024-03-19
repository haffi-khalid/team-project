export interface ICharityAdmin {
  id: number;
  isCharityAdmin?: boolean | null;
}

export type NewCharityAdmin = Omit<ICharityAdmin, 'id'> & { id: null };
