export interface Notification {
  id: number;
  author: any;
  friendInvite: any;
  teamInvite: any;
  title: string;
  message: string;
  checked?: boolean;
  created_at: string;
}
