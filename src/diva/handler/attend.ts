import { Repositories } from "../repo";
import { attendRequest } from "../request/attend";
import { attendResponse } from "../response/attend";
import logger from "debug";

const debug = logger("app:diva:handler:attend");

let etcParamArray = new Array(100);
etcParamArray.fill(0);
etcParamArray[9] = 1;
Object.seal(etcParamArray);

let gameBalanceArray = new Array(100);
gameBalanceArray.fill(0);
Object.seal(gameBalanceArray);

let dispersalParamArray = new Array(100);
dispersalParamArray.fill(0);
Object.seal(dispersalParamArray);

let curDate = new Date()
  .toISOString()
  .replace(/T/, " ")
  .replace(/\..+/, "");
let aCurDate = curDate + ".0";

export async function attendHandler(
  rep: Repositories,
  req: attendRequest
): Promise<attendResponse> {
  debug("In attendHandler");
  return {
    cmd: req.cmd,
    req_id: req.req_id,
    stat: "ok",
    atnd_lut: encodeURIComponent(aCurDate),
    atnd_prm1: etcParamArray.join(","),
    atnd_prm2: gameBalanceArray.join(","),
    atnd_prm3: dispersalParamArray.join(","),
  };
}
