/**
 * Ultra-lightweight structural validator for json-to-tag inputs.
 * Strictly complies with the KeshavSoft { inParam } -> localParam naming convention.
 *
 * Scope: Checks only structural keys ("the left side": tagName, attributes, children).
 * Compares against spec-repo definitions to verify presence.
 */

const validate = ({ inJson, inSpec }) => {
  const localJson = inJson;
  const localSpec = inSpec;

  // Root must be an object
  if (!localJson || typeof localJson !== "object" || Array.isArray(localJson)) {
    return { isValid: false };
  }

  // 1. Must have a non-empty tagName string
  if (!localJson.tagName || typeof localJson.tagName !== "string" || localJson.tagName.trim() === "") {
    return { isValid: false };
  }

  // 2. If spec-repo catalog is provided, verify that the tag is recognized
  if (localSpec && typeof localSpec === "object") {
    const localKnownTagNames = Object.values(localSpec)
      .map((inSpecItem) => inSpecItem.tagName)
      .filter(Boolean);

    const localIsKnown =
      localKnownTagNames.includes(localJson.tagName) ||
      Object.keys(localSpec).includes(localJson.tagName);

    if (!localIsKnown) {
      return { isValid: false };
    }
  }

  // 3. If attributes is defined, it must be a valid key-value object (not array or primitive)
  if ("attributes" in localJson) {
    if (!localJson.attributes || typeof localJson.attributes !== "object" || Array.isArray(localJson.attributes)) {
      return { isValid: false };
    }
  }

  // 4. If children is defined, it must be an array
  if ("children" in localJson) {
    if (!Array.isArray(localJson.children)) {
      return { isValid: false };
    }
  }

  return { isValid: true };
};

export { validate };
export default validate;
