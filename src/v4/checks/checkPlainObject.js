/**
 * Story: Node Structure Requirement
 * In a declarative DOM JSON specification, every node must be a plain JSON object.
 * Primitives, null, undefined, or naked arrays are invalid at the element root.
 */
const checkPlainObject = ({ inNode, inErrors }) => {
    const localNode = inNode;
    const localErrors = inErrors;

    if (!localNode || typeof localNode !== "object" || Array.isArray(localNode)) {
        localErrors.push({
            reason: "Node must be a plain object"
        });
        return false;
    }

    return true;
};

export { checkPlainObject };
export default checkPlainObject;
