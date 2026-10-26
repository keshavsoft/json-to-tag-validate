import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validate } from "../src/v1/index.js";
import specCatalog from "../../spec-repo/src/v2/spec.json" with { type: "json" };

describe("json-to-tag-validate", () => {
  test("returns true for a valid spec matching spec-repo catalog", () => {
    const candidate = {
      tagName: "tr",
      attributes: { class: "align-middle" },
      children: []
    };

    const result = validate({ inJson: candidate, inSpec: specCatalog });
    assert.deepEqual(result, { isValid: true });
  });

  test("returns true for a known builder key (e.g. buildHeader)", () => {
    const candidate = {
      tagName: "buildHeader",
      attributes: {}
    };

    const result = validate({ inJson: candidate, inSpec: specCatalog });
    assert.deepEqual(result, { isValid: true });
  });

  test("returns false when tagName is missing", () => {
    const candidate = {
      attributes: { class: "align-middle" }
    };

    const result = validate({ inJson: candidate, inSpec: specCatalog });
    assert.deepEqual(result, { isValid: false });
  });

  test("returns false for an unrecognized tagName not in spec-repo", () => {
    const candidate = {
      tagName: "nonExistentCustomTag"
    };

    const result = validate({ inJson: candidate, inSpec: specCatalog });
    assert.deepEqual(result, { isValid: false });
  });

  test("returns false if attributes is an array or primitive instead of object", () => {
    const candidate = {
      tagName: "col",
      attributes: "width: 100px" // invalid type
    };

    const result = validate({ inJson: candidate, inSpec: specCatalog });
    assert.deepEqual(result, { isValid: false });
  });

  test("returns false if children is an object instead of an array", () => {
    const candidate = {
      tagName: "td",
      children: { tagName: "input" } // invalid type, should be array
    };

    const result = validate({ inJson: candidate, inSpec: specCatalog });
    assert.deepEqual(result, { isValid: false });
  });

  test("validates without inSpec if catalog check is omitted", () => {
    const candidate = {
      tagName: "div",
      attributes: { id: "app" },
      children: []
    };

    const result = validate({ inJson: candidate });
    assert.deepEqual(result, { isValid: true });
  });
});
