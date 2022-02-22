import logger from "debug";
import { NextFunction, Router, Request, Response } from "express";

import { SqlRepositories } from "./_factory";
import { RpcHandler, RpcWrapper } from "../rpc";
import { DataSource } from "../../sql";
import { Repositories } from "../repo";
import { ParsedUrlQuery } from "querystring";

import { gameInitHandler } from "../handler/gameInit";
import { attendHandler } from "../handler/attend";
import { pingHandler } from "../handler/ping";
import { URLSearchParams } from "url";

const debug = logger("app:diva:handler");

export default function createSqlWrapper(db: DataSource): RpcWrapper {
  let handlerDict = {
    // Needed for boot
    game_init: gameInitHandler,
    attend: gameInitHandler,

    // Databank
    ng_word: gameInitHandler,
    nv_ranking: gameInitHandler,
    ps_ranking: gameInitHandler,
    rmt_wp_list: gameInitHandler,
    festa_info: gameInitHandler,
    contest_info: gameInitHandler,
    pv_def_chr_list: gameInitHandler,
    pv_ng_mdl_list: gameInitHandler,
    cstmz_itm_ng_mdl_lst: gameInitHandler,
    banner_info: gameInitHandler,
    banner_data: gameInitHandler,
    cm_ply_info: gameInitHandler,
    qst_inf: gameInitHandler,
    pstd_h_ctrl: gameInitHandler,
    pstd_item_ng_lst: gameInitHandler,
    cstmz_itm_ctlg: gameInitHandler,
    shop_catalog: gameInitHandler,
    pv_list: gameInitHandler,

    // Card Admin
    card_procedure: gameInitHandler,
    registration: gameInitHandler,
    deport: gameInitHandler,
    init_passwd: gameInitHandler,
    change_passwd: gameInitHandler,
    change_name: gameInitHandler,

    // Play session
    pre_start: gameInitHandler,
    start: gameInitHandler,
    pd_unlock: gameInitHandler,
    spend_credit: gameInitHandler,
    no_card_end: gameInitHandler,
    end: gameInitHandler,

    // In-Game
    get_pv_pd: gameInitHandler,
    buy_module: gameInitHandler,
    buy_cstmz_itm: gameInitHandler,
    shop_exit: gameInitHandler,
    stage_start: gameInitHandler,
    stage_result: gameInitHandler,
    store_ss: gameInitHandler,

    // Other
    test: gameInitHandler,
    ping: pingHandler,
    investigate: gameInitHandler,
  };

  // We return a piece of middleware that delegates to an Express router

  const router = Router();

  // The ES6 class syntax is nice, but it lacks an `operator()` syntax, so we
  // have to do this the confusing and messy way. Declare an inner function and
  // then add "method" fields to the resulting function object.

  function self(req: Request, res: Response, next: NextFunction) {
    // Forward all requests to our embedded Express router
    return router(req, res, next);
  }

  self.install = function() {
    router.post("/", async function(req, res) {
      try {
        if (!req.is("multipart/form-data")) {
          let dbTrans = await db.transaction(txn =>
            handlerDict[req.body.cmd](new SqlRepositories(txn), req.body)
          );
          debug("Send: %s", dbTrans);
          res.send(dbTrans);
        } else {
          function paramsToObject(entries) {
            const result = {};
            for (const [key, value] of entries) {
              // each 'entry' is a [key, value] tupple
              result[key] = value;
            }
            return result;
          }

          const querystring = req.body["query"][0];
          debug("querystring: %s", querystring);
          const urlParams = new URLSearchParams(querystring);
          const entries = urlParams.entries();
          const params = paramsToObject(entries);
          debug("params: %j", params);

          let dbTrans: any = await db.transaction(txn =>
            handlerDict[params["cmd"]](new SqlRepositories(txn), params)
          );

          debug("Send: %s", new URLSearchParams(dbTrans).toString());
          res.send(new URLSearchParams(dbTrans).toString());
        }
      } catch (e) {
        if (debug.enabled) {
          debug("Error processing request: %s", e.stack);
        }
        res.sendStatus(500);
      }
    });

    // Allow .rpc() calls to be chained, since that's what Express' native
    // .post() etc methods do.

    return self;
  };

  // Done defining our Express middleware, so here it is:

  return self;
}
