import { Repositories } from "../repo";
import { Transaction } from "../../sql";

export class SqlRepositories implements Repositories {
  constructor(private readonly _txn: Transaction) {}
}
