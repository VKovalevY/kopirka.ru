import {TimeData} from "../shared/interfaces/time";

export interface Data {
  image: string | null;
  code: string | null;
  message: string;
  date: Date | null;
}
export interface Account {
  user: string[],
  password: string[]
}
export interface app {
  url: string[],
  pin: string,
  datatime: TimeData,
  account: Account
}
