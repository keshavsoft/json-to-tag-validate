/**
 * Story: Attribute Map Integrity
 * In declarative element definitions, `attributes` must be a key-value dictionary object
 * mapping attribute names to strings, booleans, or interpolation expressions.
 * Primitives, arrays, or malformed values are invalid attribute maps.
 */
const checkAttributes = ({ inNode, inErrors }) => {
    const localNode = inNode;
    const localErrors = inErrors;

    const localTagName = localNode.tagName;

    if ("attributes" in localNode) {
        if (!localNode.attributes || typeof localNode.attributes !== "object" || Array.isArray(localNode.attributes)) {
            localErrors.push({
                tagName: localTagName,
                reason: "'attributes' must be a key-value object"
            });
            return false;
        }
    }

    return true;
};

export { checkAttributes };
export default checkAttributes;
