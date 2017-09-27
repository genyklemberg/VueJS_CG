import { User } from './User';

export interface Team {
  id?: number,
  name: string,
  game_id: number,
  created_at?: Date,
  owner?: User,
  users?: Array<User>,
}
