import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validate } from "../src/v4/index.js";
import tableSample from "./v3/table.json" with { type: "json" };

describe("json-to-tag-validate v4 (Clean Check Pipeline Architecture)", () => {
  test("validates table.json cleanly with zero errors", () => {
    const result = validate({ inJson: tableSample });
    assert.equal(result.isValid, true);
    assert.equal(result.errors.length, 0);
  });

  test("catches textContent violation on void/non-text elements via checkTextContent", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[0].children[0].textContent = "Illegal col text";

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors[0].tagName, "col");
    assert.match(result.errors[0].reason, /does not allow direct textContent/);
  });

  test("catches children violation on void elements via checkChildren", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[0].children[0].children = [{ tagName: "span" }];

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors[0].tagName, "col");
    assert.match(result.errors[0].reason, /does not allow children/);
  });

  test("catches childTags nesting violation via checkChildTags", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[0].children.push({ tagName: "div" });

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors[0].tagName, "div");
    assert.match(result.errors[0].reason, /not an allowed child of 'colgroup'/);
  });

  test("catches unrecognized tag via checkTagName", () => {
    const brokenTree = JSON.parse(JSON.stringify(tableSample));
    brokenTree.children[2].children[0].children[0].tagName = "fakeUnknownTag";

    const result = validate({ inJson: brokenTree });
    assert.equal(result.isValid, false);
    assert.equal(result.errors.length, 2);
    assert.equal(result.errors[0].tagName, "fakeUnknownTag");
    assert.match(result.errors[0].reason, /not an allowed child/);
    assert.equal(result.errors[1].tagName, "fakeUnknownTag");
    assert.match(result.errors[1].reason, /not found in spec catalog/);
  });
});
