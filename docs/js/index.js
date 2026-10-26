/**
 * Monaco Editor Controller & Live Diagnostics for json-to-tag-validate
 * Strictly complies with the KeshavSoft { inParam } -> localParam naming convention.
 */

let editorInstance = null;
let currentSpecCatalog = null;

// Configure Monaco AMD paths from CDN
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs"
  }
});

/**
 * Recursively validates a node and all of its children against structural rules.
 */
function validateNode({ inNode, inPath, inSpec, inErrors }) {
  const localNode = inNode;
  const localPath = inPath;
  const localSpec = inSpec;
  const localErrors = inErrors;

  if (!localNode || typeof localNode !== "object" || Array.isArray(localNode)) {
    localErrors.push({
      path: localPath,
      reason: "Node must be a plain object"
    });
    return;
  }

  // 1. Must have tagName
  if (!localNode.tagName || typeof localNode.tagName !== "string" || localNode.tagName.trim() === "") {
    localErrors.push({
      path: localPath,
      reason: "Missing or empty 'tagName'"
    });
  } else if (localSpec && typeof localSpec === "object") {
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
        reason: `Unrecognized tagName '${localNode.tagName}' not found in catalog`
      });
    }
  }

  // 2. Check attributes
  if ("attributes" in localNode) {
    if (!localNode.attributes || typeof localNode.attributes !== "object" || Array.isArray(localNode.attributes)) {
      localErrors.push({
        path: `${localPath}.attributes`,
        reason: "'attributes' must be a key-value object"
      });
    }
  }

  // 3. Check children
  if ("children" in localNode) {
    if (!Array.isArray(localNode.children)) {
      localErrors.push({
        path: `${localPath}.children`,
        reason: "'children' must be an array"
      });
    } else {
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
 */
function validateTree({ inJson, inSpec }) {
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

/**
 * Initializes the Monaco Editor.
 */
function createMonacoInstance({ inContainerElement, inInitialValue }) {
  const localContainerElement = inContainerElement;
  const localInitialValue = inInitialValue;

  const localEditor = monaco.editor.create(localContainerElement, {
    value: localInitialValue,
    language: "json",
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 13,
    fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
    lineHeight: 20,
    tabSize: 2,
    minimap: { enabled: true },
    folding: true,
    scrollBeyondLastLine: false,
    formatOnPaste: true,
    formatOnType: true
  });

  return localEditor;
}

/**
 * Displays what is wrong in the diagnostics list panel.
 */
function renderDiagnostics({ inListElement, inStatusElement, inValidationResult }) {
  const localListElement = inListElement;
  const localStatusElement = inStatusElement;
  const localValidationResult = inValidationResult;

  if (!localListElement || !localStatusElement) return;

  localListElement.innerHTML = "";

  if (localValidationResult.isValid) {
    localStatusElement.className = "status-pill valid";
    localStatusElement.innerHTML = `<span class="status-dot"></span> 0 Errors — Tree Valid`;

    localListElement.innerHTML = `
      <div class="diag-card success">
        <div style="font-size: 28px; margin-bottom: 8px;">✓</div>
        <div style="font-size: 15px; font-weight: 700; color: var(--accent-emerald);">All Nodes Valid!</div>
        <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">
          All tree branches strictly conform to structural rules: valid <code>tagName</code>, <code>attributes</code> object, and <code>children</code> array.
        </div>
      </div>
    `;
  } else {
    const localCount = localValidationResult.errors.length;
    localStatusElement.className = "status-pill invalid";
    localStatusElement.innerHTML = `<span class="status-dot"></span> ${localCount} Error${localCount > 1 ? "s" : ""} Found`;

    localValidationResult.errors.forEach((inErr) => {
      const localErr = inErr;
      const localCard = document.createElement("div");
      localCard.className = "diag-card error";

      localCard.innerHTML = `
        <span class="diag-path">${localErr.path}</span>
        <span class="diag-reason">${localErr.reason}</span>
        ${localErr.tagName ? `<span class="diag-tag">&lt;${localErr.tagName}&gt;</span>` : ""}
      `;

      localListElement.appendChild(localCard);
    });
  }
}

/**
 * Reads text from Monaco and runs live validation.
 */
function runLiveValidation({ inEditor, inSpec, inStatusElement, inListElement }) {
  const localEditor = inEditor;
  const localSpec = inSpec;
  const localStatusElement = inStatusElement;
  const localListElement = inListElement;

  if (!localEditor) return;

  const localText = localEditor.getValue();
  let localParsedJson = null;

  try {
    localParsedJson = JSON.parse(localText);
  } catch (localParseError) {
    localStatusElement.className = "status-pill invalid";
    localStatusElement.innerHTML = `<span class="status-dot"></span> Syntax Error`;
    localListElement.innerHTML = `
      <div class="diag-card error">
        <span class="diag-path">JSON Parser</span>
        <span class="diag-reason">Malformed JSON Syntax: ${localParseError.message}</span>
      </div>
    `;
    return;
  }

  const localResult = validateTree({ inJson: localParsedJson, inSpec: localSpec });
  renderDiagnostics({
    inListElement: localListElement,
    inStatusElement: localStatusElement,
    inValidationResult: localResult
  });
}

/**
 * Displays a non-blocking toast notice.
 */
function showToastMessage({ inMessage }) {
  const localMessage = inMessage;
  let localToast = document.getElementById("toastNotice");

  if (!localToast) {
    localToast = document.createElement("div");
    localToast.id = "toastNotice";
    localToast.className = "toast-notice";
    document.body.appendChild(localToast);
  }

  localToast.textContent = localMessage;
  localToast.classList.add("show");

  setTimeout(() => {
    localToast.classList.remove("show");
  }, 2200);
}

/**
 * Copies text to user clipboard.
 */
async function copyContentToClipboard({ inText, inSuccessMessage }) {
  const localText = inText;
  const localSuccessMessage = inSuccessMessage;

  try {
    await navigator.clipboard.writeText(localText);
    showToastMessage({ inMessage: localSuccessMessage });
  } catch (localErr) {
    showToastMessage({ inMessage: "Failed to copy to clipboard" });
  }
}

/**
 * Application Bootstrap.
 */
function startApplication() {
  const localContainer = document.getElementById("monacoContainer");
  const localLoading = document.getElementById("editorLoading");
  const localStatusPill = document.getElementById("statusPill");
  const localDiagnosticsList = document.getElementById("diagnosticsList");
  const localSampleSelect = document.getElementById("sampleSelect");
  const localFormatBtn = document.getElementById("formatBtn");
  const localCopyBtn = document.getElementById("copyBtn");
  const localResetBtn = document.getElementById("resetBtn");

  // Load catalog
  currentSpecCatalog = window.ValidateSampleData ? window.ValidateSampleData.KNOWN_HTML_TAGS : {};

  const localInitialJson = window.ValidateSampleData ? window.ValidateSampleData.SAMPLE_TABLE : { tagName: "div" };
  const localInitialText = JSON.stringify(localInitialJson, null, 2);

  require(["vs/editor/editor.main"], function () {
    if (localLoading) {
      localLoading.style.display = "none";
    }

    editorInstance = createMonacoInstance({
      inContainerElement: localContainer,
      inInitialValue: localInitialText
    });

    // Run initial validation
    runLiveValidation({
      inEditor: editorInstance,
      inSpec: currentSpecCatalog,
      inStatusElement: localStatusPill,
      inListElement: localDiagnosticsList
    });

    // Run live validation on content change
    editorInstance.onDidChangeModelContent(() => {
      runLiveValidation({
        inEditor: editorInstance,
        inSpec: currentSpecCatalog,
        inStatusElement: localStatusPill,
        inListElement: localDiagnosticsList
      });
    });

    // Event: Sample Select
    if (localSampleSelect) {
      localSampleSelect.addEventListener("change", (inEvent) => {
        const localKey = inEvent.target.value;
        const localDataMap = window.ValidateSampleData || {};
        const localTargetData = localDataMap[localKey] || localDataMap.SAMPLE_TABLE;

        editorInstance.setValue(JSON.stringify(localTargetData, null, 2));

        setTimeout(() => {
          const localFormatAction = editorInstance.getAction("editor.action.formatDocument");
          if (localFormatAction) localFormatAction.run();
        }, 50);

        showToastMessage({ inMessage: `Loaded: ${inEvent.target.selectedOptions[0].text}` });
      });
    }

    // Event: Format Button
    if (localFormatBtn) {
      localFormatBtn.addEventListener("click", () => {
        if (!editorInstance) return;
        const localFormatAction = editorInstance.getAction("editor.action.formatDocument");
        if (localFormatAction) {
          localFormatAction.run();
          showToastMessage({ inMessage: "Document formatted" });
        }
      });
    }

    // Event: Copy Button
    if (localCopyBtn) {
      localCopyBtn.addEventListener("click", () => {
        if (!editorInstance) return;
        const localText = editorInstance.getValue();
        copyContentToClipboard({
          inText: localText,
          inSuccessMessage: "JSON copied to clipboard!"
        });
      });
    }

    // Event: Reset Button
    if (localResetBtn) {
      localResetBtn.addEventListener("click", () => {
        if (!editorInstance) return;
        const localTable = window.ValidateSampleData ? window.ValidateSampleData.SAMPLE_TABLE : {};
        editorInstance.setValue(JSON.stringify(localTable, null, 2));
        if (localSampleSelect) localSampleSelect.value = "SAMPLE_TABLE";
        showToastMessage({ inMessage: "Reset to valid table sample" });
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  startApplication();
});
