import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validate } from "../src/v3/index.js";
import tableSample from "../../json-to-dom/samples/v42/table/table.json" with { type: "json" };

describe("json-to-tag-validate v3 (Decoupled Traversal + spec-repo tags.json Inspection)", () => {
  test("validates nested tree table.json cleanly with zero errors using default spec-repo catalog", () => {
    const result = validate({ inJson: tableSample });
    assert.equal(result.isValid, true);
    assert.equal(result.errors.length, 0);
  });

  test("catches textContent violation on tags that forbid it (allowsTextContent: false)", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    // col has allowsTextContent: false
    brokenTree.children[0].children[0].textContent = "Illegal col text";

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].tagName, "col");
    assert.match(result.errors[0].reason, /does not allow direct textContent/);
  });

  test("catches children violation on void elements (allowsChildren: false)", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    // col has allowsChildren: false
    brokenTree.children[0].children[0].children = [{ tagName: "span" }];

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].tagName, "col");
    assert.match(result.errors[0].reason, /does not allow children/);
  });

  test("catches childTags restriction violation (e.g. colgroup only allows col)", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    // colgroup childTags: ["col"]. Adding div is illegal!
    brokenTree.children[0].children.push({ tagName: "div" });

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].tagName, "div");
    assert.match(result.errors[0].reason, /not an allowed child of 'colgroup'/);
  });

  test("detects unrecognized tag in deep tree against spec-repo tags.json", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[2].children[0].children[0].tagName = "fakeUnknownTag";

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 2);
    // 1. Violation of tr.childTags (allowed: td, th)
    assert.equal(result.errors[0].tagName, "fakeUnknownTag");
    assert.match(result.errors[0].reason, /not an allowed child/);
    // 2. Unrecognized in catalog
    assert.equal(result.errors[1].tagName, "fakeUnknownTag");
    assert.match(result.errors[1].reason, /not found in spec catalog/);
  });
});
