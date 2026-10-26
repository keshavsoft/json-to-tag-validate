import { validate } from "../../src/index.js";

import table from "./table.json" with { type: "json" };

const result = validate({ inJson: table, inSpec: table });
console.log(result);