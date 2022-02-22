import { baseResponse } from "./baseResponse";

export interface attendResponse extends baseResponse {
  atnd_lut: string;
  atnd_prm1: string;
  atnd_prm2: string;
  atnd_prm3: string;
}
