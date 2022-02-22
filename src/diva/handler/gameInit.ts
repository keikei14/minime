import { Repositories } from "../repo";
import { gameInitRequest } from "../request/gameInit";
import { gameInitResponse } from "../response/gameInit";

export async function gameInitHandler(
  rep: Repositories,
  req: gameInitRequest
): Promise<gameInitResponse> {
  return {
    cmd: req.cmd,
    req_id: req.req_id,
    stat: "ok",
  };
}
