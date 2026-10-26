/**
 * Story: Void Elements & Children Permissions
 * According to HTML5 and tags.json (`allowsChildren`), void elements (such as `<input>`,
 * `<col>`, `<img>`, and `<hr>`) cannot have child elements or closing tag children.
 */
const checkChildren = ({ inNode, inCatalog, inErrors }) => {
    const localNode = inNode;
    const localCatalog = inCatalog;
    const localErrors = inErrors;

    const localTagName = localNode.tagName;
    const localTagDef = localCatalog ? localCatalog[localTagName] : null;

    if (localTagDef && localTagDef.allowsChildren === false && Array.isArray(localNode.children) && localNode.children.length > 0) {
        localErrors.push({
            tagName: localTagName,
            reason: `Tag '${localTagName}' does not allow children (void element)`
        });
        return false;
    }

    if ("children" in localNode && !Array.isArray(localNode.children)) {
        localErrors.push({
            tagName: localTagName,
            reason: "'children' must be an array"
        });
        return false;
    }

    return true;
};

export { checkChildren };
export default checkChildren;
