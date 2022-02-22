import { Repositories } from "../repo";
import { pingRequest } from "../request/ping";
import { pingResponse } from "../response/ping";

export async function pingHandler(
  rep: Repositories,
  req: pingRequest
): Promise<pingResponse> {
  return {
    cmd: req.cmd,
    req_id: req.req_id,
    stat: "ok",
    news: "<F_COL_RED> fat cock",
    warning: "<F_COL_MIKU> small cock",
  };
}
