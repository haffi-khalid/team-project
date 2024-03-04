export interface IUserPage {
  id: number;
  volunteerHours?: number | null;
  userBio?: string | null;
  reviewComment?: string | null;
  course?: string | null;
  skills?: string | null;
}

export type NewUserPage = Omit<IUserPage, 'id'> & { id: null };
