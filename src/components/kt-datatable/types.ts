export interface TableHeader {
  key: string;
  name: string;
  text?: boolean;
  currency?: boolean;
  profit?: boolean;
  customslot?: boolean;
  columnSum?: boolean;
  columnSumColor?: string;
  columnSumIcon?: string;
  customColumnSum?: boolean;
  columnWidth?: number;
  [key: string]: any;
}

export interface TableRow {
  [key: string]: any;
  game_name?: string;
  member_id?: string;
  agent_id?: string;
  gmaster_id?: string;
  state?: number;
}