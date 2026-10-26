import { traverse } from "./index.js";

/**
 * Traverse an array of specifications and delegate each item to the traversal engine.
 */
const traverseArray = ({ inItems, inFunc }) => {
    const localItems = inItems;
    const localFunc = inFunc;

    if (!Array.isArray(localItems)) {
        return;
    }

    localItems.forEach((inItem) => {
        traverse({ inSpec: inItem, inFunc: localFunc });
    });
};

export { traverseArray };
export default traverseArray;
