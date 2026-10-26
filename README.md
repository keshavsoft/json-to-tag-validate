# @keshavsoft/json-to-tag-validate

> **Clean, zero-bloat structural validator for JSON tag specifications.**  
> Recursively traverses nested tree specifications (like `table.json`) and pinpoints exactly what is wrong.

[![Live Monaco Diagnostics](https://img.shields.io/badge/Monaco_Docs-Live_Tree_Diagnostics-059669?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://keshavsoft.github.io/json-to-tag-validate/)
[![License: ISC](https://img.shields.io/badge/License-ISC-34d399?style=for-the-badge)](LICENSE)

---

## 🌐 Interactive Monaco Playground & Diagnostics

Test and validate real-world nested tree JSON specs live in the browser:

👉 **[Launch Live Tree Validator Hub](https://keshavsoft.github.io/json-to-tag-validate/)**

* 💻 **Monaco Editor**: Live JSON editing with syntax validation and instant re-validation on every keystroke.
* 🌲 **Tree Traversal**: Handles multi-level hierarchies (`table -> colgroup -> thead -> tbody -> tr -> td`).
* 🚨 **Show What's Wrong**: Displays diagnostic cards with the exact node path (`root.children[1].children[0]`) and failure reason.
* 📦 **Built-in Presets**: Quickly load `table.json` or pre-configured broken trees (missing `tagName`, invalid `attributes`, bad `children`).

---

## 🚀 Usage

### v2 (Recommended: Recursive Tree Traversal + Diagnostics)

```javascript
import { validate } from "@keshavsoft/json-to-tag-validate";

const nestedTableTree = {
  tagName: "table",
  attributes: { class: "table" },
  children: [
    {
      tagName: "tbody",
      children: [
        {
          tagName: "tr",
          children: [
            { tagName: "td", textContent: "Data Cell" }
          ]
        }
      ]
    }
  ]
};

const result = validate({ inJson: nestedTableTree });
console.log(result);
// { isValid: true, errors: [] }
```

### When Something is Wrong (Pinpoints Exact Path & Issue)

```javascript
const brokenTree = {
  tagName: "table",
  children: [
    {
      tagName: "tbody",
      children: [
        {
          // Missing tagName here!
          attributes: { class: "align-middle" }
        }
      ]
    }
  ]
};

const result = validate({ inJson: brokenTree });
console.log(result);
/*
{
  isValid: false,
  errors: [
    {
      path: "root.children[0].children[0]",
      reason: "Missing or empty 'tagName'"
    }
  ]
}
*/
```

---

## 📁 Versions Available

* **`v4` (Default - Modular Check Pipeline)**: Clean traversal engine delegating to isolated, single-responsibility checks under `src/v4/checks/` (`checkPlainObject`, `checkTagName`, `checkTextContent`, `checkChildren`, `checkChildTags`, `checkAttributes`).
* **`v3`**: Decoupled traversal engine + single node inspector.
  ```javascript
  import { validate as validateV3 } from "json-to-tag-validate/src/v3/index.js";
  ```
* **`v2`**: Recursive tree traversal checking basic JSON shape (`tagName`, `attributes`, `children`).
  ```javascript
  import { validate as validateV2 } from "json-to-tag-validate/src/v2/index.js";
  ```
* **`v1`**: Flat single-node validator returning `{ isValid: boolean }`.
  ```javascript
  import { validate as validateV1 } from "json-to-tag-validate/src/v1/index.js";
  ```

---

## 📐 Parameter Naming Convention

All functions strictly follow the KeshavSoft `{ inParam }` -> `localParam` naming standard:

```javascript
function validate({ inJson, inSpec }) {
  const localJson = inJson;
  const localSpec = inSpec;
  // Internal logic only references localJson and localSpec
}
```

---

## 📄 License

[ISC](LICENSE) © [KeshavSoft](https://github.com/keshavsoft)
