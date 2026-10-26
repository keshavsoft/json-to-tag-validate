import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validate } from "../src/v2/index.js";
import tableSample from "../../json-to-dom/samples/v42/table/table.json" with { type: "json" };
import tagsCatalog from "../../json-to-tag/docs/tags/tags.json" with { type: "json" };

describe("json-to-tag-validate v2 (Tree Traversal & Diagnostics)", () => {
  test("validates a large nested tree JSON (table.json) successfully", () => {
    const result = validate({ inJson: tableSample, inSpec: tagsCatalog });
    assert.equal(result.isValid, true);
    assert.equal(result.errors.length, 0);
  });

  test("pinpoints exact path and reason when a deeply nested child has missing tagName", () => {
    // Clone tableSample and delete a deep child's tagName
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    delete brokenTree.children[0].children[0].tagName; // colgroup -> col[0]

    const result = validate({ inJson: brokenTree, inSpec: tagsCatalog });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].path, "root.children[0].children[0]");
    assert.equal(result.errors[0].reason, "Missing or empty 'tagName'");
  });

  test("pinpoints exact path and reason when a deeply nested child has invalid attributes type", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[1].children[0].children[0].attributes = "bad-string"; // thead -> tr -> th

    const result = validate({ inJson: brokenTree, inSpec: tagsCatalog });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].path, "root.children[1].children[0].children[0].attributes");
    assert.equal(result.errors[0].reason, "'attributes' must be a key-value object");
  });

  test("pinpoints exact path and reason when children is not an array", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[2].children = "not-an-array"; // tbody

    const result = validate({ inJson: brokenTree, inSpec: tagsCatalog });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].path, "root.children[2].children");
    assert.equal(result.errors[0].reason, "'children' must be an array");
  });

  test("detects unrecognized tag in deeply nested hierarchy", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[2].children[0].children[0].tagName = "invalidFakeTag";

    const result = validate({ inJson: brokenTree, inSpec: tagsCatalog });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].path, "root.children[2].children[0].children[0]");
    assert.equal(result.errors[0].tagName, "invalidFakeTag");
  });
});
