/**
 * Story: HTML Parent-Child Nesting Hierarchies
 * HTML specifications require strict parent-child nesting for structural elements:
 * - `<colgroup>` may only contain `<col>`
 * - `<table>` may only contain `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`
 * - `<ul>` and `<ol>` may only contain `<li>`
 * - `<select>` may only contain `<option>`
 *
 * When `childTags` is specified on a catalog tag definition, any child outside that list
 * is flagged as an illegal structural placement.
 */
const checkChildTags = ({ inNode, inCatalog, inErrors }) => {
    const localNode = inNode;
    const localCatalog = inCatalog;
    const localErrors = inErrors;

    const localTagName = localNode.tagName;
    const localTagDef = localCatalog ? localCatalog[localTagName] : null;

    if (localTagDef && Array.isArray(localTagDef.childTags) && localTagDef.childTags.length > 0 && Array.isArray(localNode.children)) {
        localNode.children.forEach((inChild) => {
            if (inChild && inChild.tagName && !localTagDef.childTags.includes(inChild.tagName)) {
                localErrors.push({
                    tagName: inChild.tagName,
                    reason: `Tag '${inChild.tagName}' is not an allowed child of '${localTagName}' (allowed: ${localTagDef.childTags.join(", ")})`
                });
            }
        });
    }

    return true;
};

export { checkChildTags };
export default checkChildTags;
