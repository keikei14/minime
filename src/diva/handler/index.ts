import logger from "debug";
import express from "express";
import { Form } from "multiparty";
import read from "raw-body";
import { inflateSync } from "zlib";
import testHandler from "./test";

import createSqlWrapper from "../sql";
import { DataSource } from "../../sql";

const debug = logger("app:diva:io");

export default function diva(db: DataSource) {
  const wrapper = createSqlWrapper(db);
  const app = express();

  // Middleware
  app.use(async function(req, res, next) {
    const send_ = res.send;
    res.send = function(kvps) {
      debug("Response: %j", kvps);

      const bits: string[] = [];

      for (const key in kvps) {
        const val = kvps[key];
        const bit = [key, val].map(escape).join("=");

        bits.push(bit);
      }

      const str = bits.join("&");

      res.header("content-type", "text/plain");

      return send_.apply(res, [str]);
    };

    if (req.is("application/x-www-form-urlencoded")) {
      let line: string;

      if (req.header("pragma") === "DFI") {
        const raw = await read(req, "ascii");
        const z = Buffer.from(raw, "base64");
        const bytes = inflateSync(z);

        line = bytes.toString("utf8");
      } else {
        line = await read(req, "utf8");
      }

      const kvps = line.split("&");
      const body = {};

      for (const kvp of kvps) {
        const [key, val] = kvp.split("=").map(unescape);

        body[key] = val;
      }

      req.body = body;

      debug("\n--- Diva ---\n");
      debug("Request: %j", req.body);

      return next();
    } else if (req.is("multipart/form-data")) {
      const form = new Form();

      form.parse(req, function(err, fields, files) {
        if (err) {
          return next(err);
        }

        req.body = { ...files, ...fields };

        debug("\n--- Diva (Multipart) ---\n");
        debug("Request: %j", req.body);

        return next();
      });
    } else {
      return next(new Error("Unhandled content-type"));
    }
  });

  wrapper.install();
  app.use("/", wrapper);

  return app;
}
