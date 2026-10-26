/**
 * Story: Direct Text Content Permissions
 * In HTML semantic rules (declared in tags.json under `allowsTextContent`), elements like
 * `<input>`, `<col>`, `<img>`, and `<div>` forbid direct text nodes. Only phrasing elements
 * (like `<p>`, `<span>`, `<h1>`, `<th>`, `<td>`, `<button>`) allow textContent.
 */
const checkTextContent = ({ inNode, inCatalog, inErrors }) => {
    const localNode = inNode;
    const localCatalog = inCatalog;
    const localErrors = inErrors;

    const localTagName = localNode.tagName;
    const localTagDef = localCatalog ? localCatalog[localTagName] : null;

    if (localTagDef && localTagDef.allowsTextContent === false && localNode.textContent) {
        localErrors.push({
            tagName: localTagName,
            reason: `Tag '${localTagName}' does not allow direct textContent`
        });
        return false;
    }

    return true;
};

export { checkTextContent };
export default checkTextContent;
