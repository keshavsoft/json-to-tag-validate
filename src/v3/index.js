import { traverse } from "./traverse/index.js";
import defaultTags from "../../../spec-repo/src/v3/tags.json" with { type: "json" };

/**
 * json-to-tag-validate v3: Decoupled Traversal + Outside Tag Catalog Inspection
 * Strictly complies with the KeshavSoft { inParam } -> localParam naming convention.
 *
 * Uses a clean, reusable traversal engine (modeled after json-to-tag) and injects
 * a node inspection function created outside holding reference to tags.json.
 */
function validate({ inJson, inCatalog, inSpec }) {
    const localJson = inJson;
    const localCatalog = inCatalog ?? inSpec ?? defaultTags;
    const localErrors = [];

    // The validation function is created outside, holding reference to localCatalog:
    const checkNode = (inNode) => {
        if (!inNode || typeof inNode !== "object" || Array.isArray(inNode)) {
            localErrors.push({
                reason: "Node must be a plain object"
            });
            return;
        }

        const localTagName = inNode.tagName;
        if (!localTagName || typeof localTagName !== "string" || localTagName.trim() === "") {
            localErrors.push({
                reason: "Missing or empty 'tagName'"
            });
            return;
        }

        const localTagDef = localCatalog ? localCatalog[localTagName] : null;

        // 1. Verify tag presence in catalog
        if (localCatalog && typeof localCatalog === "object") {
            const localIsKnown = Boolean(localTagDef) || Object.keys(localCatalog).includes(localTagName);
            if (!localIsKnown) {
                localErrors.push({
                    tagName: localTagName,
                    reason: `Unrecognized tagName '${localTagName}' not found in spec catalog`
                });
            }
        }

        // 2. Verify text content permission (allowsTextContent: false)
        if (localTagDef && localTagDef.allowsTextContent === false && inNode.textContent) {
            localErrors.push({
                tagName: localTagName,
                reason: `Tag '${localTagName}' does not allow direct textContent`
            });
        }

        // 3. Verify children permission (allowsChildren: false)
        if (localTagDef && localTagDef.allowsChildren === false && Array.isArray(inNode.children) && inNode.children.length > 0) {
            localErrors.push({
                tagName: localTagName,
                reason: `Tag '${localTagName}' does not allow children (void element)`
            });
        }

        // 4. Verify childTags nesting restrictions
        if (localTagDef && Array.isArray(localTagDef.childTags) && localTagDef.childTags.length > 0 && Array.isArray(inNode.children)) {
            inNode.children.forEach((inChild) => {
                if (inChild && inChild.tagName && !localTagDef.childTags.includes(inChild.tagName)) {
                    localErrors.push({
                        tagName: inChild.tagName,
                        reason: `Tag '${inChild.tagName}' is not an allowed child of '${localTagName}' (allowed: ${localTagDef.childTags.join(", ")})`
                    });
                }
            });
        }

        // 5. Verify attributes is a key-value object
        if ("attributes" in inNode) {
            if (!inNode.attributes || typeof inNode.attributes !== "object" || Array.isArray(inNode.attributes)) {
                localErrors.push({
                    tagName: localTagName,
                    reason: "'attributes' must be a key-value object"
                });
            }
        }

        // 6. Verify children is an array if defined
        if ("children" in inNode && !Array.isArray(inNode.children)) {
            localErrors.push({
                tagName: localTagName,
                reason: "'children' must be an array"
            });
        }
    };

    // Run clean traversal with the outside inspection function:
    traverse({ inSpec: localJson, inFunc: checkNode });

    return {
        isValid: localErrors.length === 0,
        errors: localErrors
    };
}

export { validate, traverse };
export default validate;
