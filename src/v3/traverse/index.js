import { traverseArray } from "./traverseArray.js";
import { traverseObject } from "./traverseObject.js";

/**
 * Clean, generic traversal dispatcher modeled directly after json-to-tag/src/v11/traverse/index.js.
 * Takes { inSpec, inFunc } and delegates to array or object traversers.
 */
const traverse = ({ inSpec, inFunc }) => {
    const localSpec = inSpec;
    const localFunc = inFunc;

    if (localSpec === null || localSpec === undefined) {
        return;
    }

    if (Array.isArray(localSpec)) {
        return traverseArray({ inItems: localSpec, inFunc: localFunc });
    }

    if (typeof localSpec === "object") {
        return traverseObject({ inSpec: localSpec, inFunc: localFunc });
    }
};

export { traverse };
export default traverse;
