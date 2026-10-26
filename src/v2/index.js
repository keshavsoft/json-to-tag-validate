/**
 * json-to-tag-validate v2: Recursive Tree Traversal & Diagnostics
 * Strictly complies with the KeshavSoft { inParam } -> localParam naming convention.
 *
 * Traverses nested JSON trees (e.g. table -> colgroup -> thead -> tbody -> tr -> td).
 * Collects exact path and reason for any structural mismatch ("the left side").
 */

/**
 * Recursively validates a single node and all its children.
 */
function validateNode({ inNode, inPath, inSpec, inErrors }) {
  const localNode = inNode;
  const localPath = inPath;
  const localSpec = inSpec;
  const localErrors = inErrors;

  // 1. Must be a plain object
  if (!localNode || typeof localNode !== "object" || Array.isArray(localNode)) {
    localErrors.push({
      path: localPath,
      reason: "Node must be a plain object"
    });
    return;
  }

  // 2. Check tagName (the primary tag identity)
  if (!localNode.tagName || typeof localNode.tagName !== "string" || localNode.tagName.trim() === "") {
    localErrors.push({
      path: localPath,
      reason: "Missing or empty 'tagName'"
    });
  } else if (localSpec && typeof localSpec === "object") {
    // Check against catalog: either as a tag name or as a template key
    const localKnownTagNames = Object.values(localSpec)
      .map((inSpecItem) => inSpecItem && inSpecItem.tagName)
      .filter(Boolean);

    const localIsKnown =
      localKnownTagNames.includes(localNode.tagName) ||
      Object.keys(localSpec).includes(localNode.tagName);

    if (!localIsKnown) {
      localErrors.push({
        path: localPath,
        tagName: localNode.tagName,
        reason: `Unrecognized tagName '${localNode.tagName}' not found in spec catalog`
      });
    }
  }

  // 3. Check attributes (must be a key-value object)
  if ("attributes" in localNode) {
    if (!localNode.attributes || typeof localNode.attributes !== "object" || Array.isArray(localNode.attributes)) {
      localErrors.push({
        path: `${localPath}.attributes`,
        reason: "'attributes' must be a key-value object"
      });
    }
  }

  // 4. Check children and perform recursive tree traversal
  if ("children" in localNode) {
    if (!Array.isArray(localNode.children)) {
      localErrors.push({
        path: `${localPath}.children`,
        reason: "'children' must be an array"
      });
    } else {
      // Tree traversal: validate each child node recursively
      localNode.children.forEach((inChildNode, inIndex) => {
        const localChildNode = inChildNode;
        const localIndex = inIndex;
        const localChildPath = `${localPath}.children[${localIndex}]`;

        validateNode({
          inNode: localChildNode,
          inPath: localChildPath,
          inSpec: localSpec,
          inErrors: localErrors
        });
      });
    }
  }
}

/**
 * Top-level tree validator.
 * Returns { isValid: boolean, errors: Array<{ path, reason, tagName? }> }
 */
function validate({ inJson, inSpec }) {
  const localJson = inJson;
  const localSpec = inSpec;
  const localErrors = [];

  validateNode({
    inNode: localJson,
    inPath: "root",
    inSpec: localSpec,
    inErrors: localErrors
  });

  return {
    isValid: localErrors.length === 0,
    errors: localErrors
  };
}

export { validate };
export default validate;
