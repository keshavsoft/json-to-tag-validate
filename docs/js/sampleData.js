/**
 * Sample tree data for testing live validation in Monaco Editor
 */

const SAMPLE_TABLE = {
  "tagName": "table",
  "attributes": {
    "class": "table table-hover table-striped align-middle border mb-0"
  },
  "children": [
    {
      "tagName": "colgroup",
      "attributes": {
        "data-role": "table-colgroup"
      },
      "children": [
        {
          "tagName": "col",
          "attributes": {
            "width": "70%"
          }
        }
      ]
    },
    {
      "tagName": "thead",
      "attributes": {
        "class": "table-dark",
        "data-role": "table-header"
      },
      "children": [
        {
          "tagName": "tr",
          "attributes": {
            "data-role": "table-header-row"
          },
          "children": [
            {
              "tagName": "th",
              "textContent": "itemName",
              "attributes": {
                "class": "py-3 px-3 fw-semibold text-uppercase small"
              }
            }
          ]
        }
      ]
    },
    {
      "tagName": "tbody",
      "attributes": {
        "data-role": "table-body"
      },
      "children": [
        {
          "tagName": "tr",
          "attributes": {
            "class": "align-middle"
          },
          "children": [
            {
              "tagName": "td",
              "textContent": "0.09/30mm",
              "attributes": {
                "class": "py-3 px-3 text-secondary"
              }
            }
          ]
        }
      ]
    },
    {
      "tagName": "tfoot",
      "attributes": {
        "data-role": "table-footer"
      },
      "children": [
        {
          "tagName": "tr",
          "attributes": {
            "data-role": "table-footer-row"
          },
          "children": []
        }
      ]
    }
  ]
};

const SAMPLE_MISSING_TAG_NAME = {
  "tagName": "table",
  "children": [
    {
      "tagName": "thead",
      "children": [
        {
          "tagName": "tr",
          "children": [
            {
              "textContent": "Missing tagName property right here!",
              "attributes": { "class": "text-danger" }
            }
          ]
        }
      ]
    }
  ]
};

const SAMPLE_BAD_ATTRIBUTES = {
  "tagName": "table",
  "children": [
    {
      "tagName": "colgroup",
      "attributes": "width: 100%", // ERROR: must be an object
      "children": [
        {
          "tagName": "col",
          "attributes": { "width": "50%" }
        }
      ]
    }
  ]
};

const SAMPLE_BAD_CHILDREN = {
  "tagName": "tbody",
  "children": { // ERROR: must be an array
    "tagName": "tr"
  }
};

const SAMPLE_UNKNOWN_TAG = {
  "tagName": "table",
  "children": [
    {
      "tagName": "unrecognizedWidgetBox",
      "attributes": {}
    }
  ]
};

// Known HTML tags catalog for validation check
const KNOWN_HTML_TAGS = {
  "table": { "tagName": "table" },
  "colgroup": { "tagName": "colgroup" },
  "col": { "tagName": "col" },
  "thead": { "tagName": "thead" },
  "tbody": { "tagName": "tbody" },
  "tfoot": { "tagName": "tfoot" },
  "tr": { "tagName": "tr" },
  "th": { "tagName": "th" },
  "td": { "tagName": "td" },
  "button": { "tagName": "button" },
  "input": { "tagName": "input" },
  "select": { "tagName": "select" },
  "option": { "tagName": "option" },
  "datalist": { "tagName": "datalist" },
  "div": { "tagName": "div" },
  "span": { "tagName": "span" },
  "label": { "tagName": "label" },
  "p": { "tagName": "p" },
  "form": { "tagName": "form" }
};

window.ValidateSampleData = {
  SAMPLE_TABLE,
  SAMPLE_MISSING_TAG_NAME,
  SAMPLE_BAD_ATTRIBUTES,
  SAMPLE_BAD_CHILDREN,
  SAMPLE_UNKNOWN_TAG,
  KNOWN_HTML_TAGS
};
