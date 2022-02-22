import { baseResponse } from "./baseResponse";

export interface pingResponse extends baseResponse {
  news: string;
  warning: string;
}
