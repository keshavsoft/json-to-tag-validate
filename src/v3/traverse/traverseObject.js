import { traverseArray } from "./traverseArray.js";

/**
 * Traverse one JSON element specification and execute the injected outside function.
 * Modeled after json-to-tag traverseObject, decoupled from DOM creation.
 */
const traverseObject = ({ inSpec, inFunc }) => {
    const localSpec = inSpec;
    const localFunc = inFunc;

    if (!localSpec || typeof localSpec !== "object" || Array.isArray(localSpec)) {
        return;
    }

    // Execute the outside function with the current node:
    if (typeof localFunc === "function") {
        localFunc(localSpec);
    }

    // Delegate recursive traversal to children:
    if (Array.isArray(localSpec.children)) {
        traverseArray({ inItems: localSpec.children, inFunc: localFunc });
    }
};

export { traverseObject };
export default traverseObject;
