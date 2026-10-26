import { checkPlainObject } from "./checkPlainObject.js";
import { checkTagName } from "./checkTagName.js";
import { checkTextContent } from "./checkTextContent.js";
import { checkChildren } from "./checkChildren.js";
import { checkChildTags } from "./checkChildTags.js";
import { checkAttributes } from "./checkAttributes.js";

/**
 * Story: Composite Node Check Pipeline
 * Runs all modular checks in sequence on a single visited element node.
 * Each check is responsible for a single rule with clean diagnostics.
 */
const runChecks = ({ inNode, inCatalog, inErrors }) => {
    const localNode = inNode;
    const localCatalog = inCatalog;
    const localErrors = inErrors;

    // 1. Structure check: must be a plain object
    if (!checkPlainObject({ inNode: localNode, inErrors: localErrors })) {
        return;
    }

    // 2. Tag identity & catalog check
    checkTagName({ inNode: localNode, inCatalog: localCatalog, inErrors: localErrors });

    // 3. Text content permissions
    checkTextContent({ inNode: localNode, inCatalog: localCatalog, inErrors: localErrors });

    // 4. Void element / children permissions
    checkChildren({ inNode: localNode, inCatalog: localCatalog, inErrors: localErrors });

    // 5. Parent-child nesting restrictions
    checkChildTags({ inNode: localNode, inCatalog: localCatalog, inErrors: localErrors });

    // 6. Attributes object integrity
    checkAttributes({ inNode: localNode, inErrors: localErrors });
};

export {
    runChecks,
    checkPlainObject,
    checkTagName,
    checkTextContent,
    checkChildren,
    checkChildTags,
    checkAttributes
};
export default runChecks;
