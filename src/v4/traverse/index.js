import { traverseArray } from "./traverseArray.js";
import { traverseObject } from "./traverseObject.js";

/**
 * Pure Traversal Dispatcher.
 * Delegates tree specifications to array or object traversers without domain knowledge.
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
