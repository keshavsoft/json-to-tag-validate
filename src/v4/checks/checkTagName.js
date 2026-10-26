/**
 * Story: Primary Tag Identity & Catalog Presence
 * Every element node must declare a non-empty `tagName` string (e.g., 'table', 'div', 'input').
 * Furthermore, when a tag catalog (spec-repo tags.json) is provided, the tagName must exist
 * in the catalog to catch typos (e.g., 'dv' instead of 'div').
 */
const checkTagName = ({ inNode, inCatalog, inErrors }) => {
    const localNode = inNode;
    const localCatalog = inCatalog;
    const localErrors = inErrors;

    const localTagName = localNode.tagName;

    if (!localTagName || typeof localTagName !== "string" || localTagName.trim() === "") {
        localErrors.push({
            reason: "Missing or empty 'tagName'"
        });
        return false;
    }

    if (localCatalog && typeof localCatalog === "object") {
        const localTagDef = localCatalog[localTagName];
        const localIsKnown = Boolean(localTagDef) || Object.keys(localCatalog).includes(localTagName);

        if (!localIsKnown) {
            localErrors.push({
                tagName: localTagName,
                reason: `Unrecognized tagName '${localTagName}' not found in spec catalog`
            });
            return false;
        }
    }

    return true;
};

export { checkTagName };
export default checkTagName;
