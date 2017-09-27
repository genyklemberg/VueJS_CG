export interface User {
  id: number
  avatar: string
  name: string
  nickname?: string
  email?: string
  confirmed?: boolean
  steam_id?: number
  manual_stats_update?: string
  token: string
  UserCsgoStat: any
  UserDotaStat: any
  tags: any
  team?: {
    team_id: number
    created_at: Date
  }
}
