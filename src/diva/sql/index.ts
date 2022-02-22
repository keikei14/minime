import logger from "debug";
import { NextFunction, Router, Request, Response } from "express";
import { Form } from "multiparty";
import read from "raw-body";
import { inflateSync } from "zlib";

import { SqlRepositories } from "./_factory";
import { RpcHandler, RpcWrapper } from "../rpc";
import { DataSource } from "../../sql";

const debug = logger("app:diva:handler");

export default function createSqlWrapper(db: DataSource): RpcWrapper {
  // We return a piece of middleware that delegates to an Express router

  const router = Router();

  // The ES6 class syntax is nice, but it lacks an `operator()` syntax, so we
  // have to do this the confusing and messy way. Declare an inner function and
  // then add "method" fields to the resulting function object.

  function self(req: Request, res: Response, next: NextFunction) {
    // Forward all requests to our embedded Express router
    return router(req, res, next);
  }

  self.rpc = function<Q, R>(cmd: string, handler: RpcHandler<Q, R>) {
    router.post("/", async function(req, res) {
      if (cmd === req.body.cmd) {
        try {
          let dbTrans = await db.transaction(txn =>
            handler(new SqlRepositories(txn), req.body)
          );
          debug("Send: %s", dbTrans);
          res.send(dbTrans);
        } catch (e) {
          if (debug.enabled) {
            debug("Error processing request: %s", e.stack);
          }
          res.sendStatus(500);
        }
      } else {
        debug("Error processing request: %s", req.body);
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
