import { validate } from "../../src/index.js";
import table from "../v3/table.json" with { type: "json" };

const result = validate({ inJson: table });
console.log("Validation Result for table.json:", result);
