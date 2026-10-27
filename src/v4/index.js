import { traverse } from "json-traversal";
import { runChecks } from "./checks/index.js";
import { tags as defaultTags } from "spec-repo";



/**
 * json-to-tag-validate v4: Clean Pipeline Architecture
 * Strictly complies with the KeshavSoft { inParam } -> localParam naming convention.
 *
 * Decouples the traversal engine from validation rules.
 * Each validation check lives in its own dedicated file under ./checks/.
 */
function validate({ inJson, inCatalog, inSpec }) {
    const localJson = inJson;
    const localCatalog = inCatalog ?? inSpec ?? defaultTags;
    const localErrors = [];

    // Traverse the JSON tree and run the modular check pipeline at each node:
    traverse({
        inSpec: localJson,
        inFunc: (inNode) => {
            runChecks({
                inNode,
                inCatalog: localCatalog,
                inErrors: localErrors
            });
        }
    });

    return {
        isValid: localErrors.length === 0,
        errors: localErrors
    };
}

export { validate, traverse, runChecks };
export default validate;
