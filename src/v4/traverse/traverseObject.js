import { traverseArray } from "./traverseArray.js";

/**
 * Traverse one JSON element specification and execute the outside function.
 * Decoupled from DOM creation: solely responsible for visiting the node and recursing into children.
 */
const traverseObject = ({ inSpec, inFunc }) => {
    const localSpec = inSpec;
    const localFunc = inFunc;

    if (!localSpec || typeof localSpec !== "object" || Array.isArray(localSpec)) {
        return;
    }

    if (typeof localFunc === "function") {
        localFunc(localSpec);
    }

    if (Array.isArray(localSpec.children)) {
        traverseArray({ inItems: localSpec.children, inFunc: localFunc });
    }
};

export { traverseObject };
export default traverseObject;
