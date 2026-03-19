# XML to JSON Converter

Convert XML documents to JSON using a recursive DOM walker with attribute, text, and repeated-tag handling, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/developer-tools/xml-to-json-online

## How It Works

The XML input is parsed with `DOMParser.parseFromString(text, 'application/xml')` and validated for `parsererror` elements. `nodeToObj(node)` recurses through the DOM: element attributes are collected into an `@attributes` object. Child elements are processed recursively — if a tag name already exists in the result object, the value is converted to an array (or appended to an existing array) to handle repeated sibling tags. Text-only nodes return the `textContent` string directly. Mixed content (text plus elements) is assigned to a `#text` key. The resulting JavaScript object is serialized with `JSON.stringify(result, null, 2)`.

## Features

- DOMParser XML parsing with error detection
- Attributes mapped to `@attributes` key
- Repeated sibling tags collapsed into arrays
- Text-only elements return plain string values
- Mixed content uses `#text` key
- Copy output to clipboard

## Browser APIs Used

- DOMParser (`parseFromString` with `application/xml`)
- Clipboard API (`navigator.clipboard.writeText`)

## Code Structure

| File | Description |
|------|-------------|
| `xml-to-json.js` | `DOMParser` parse + `parsererror` check, recursive `nodeToObj` (`@attributes`, repeated-tag array, `#text` for mixed content), `JSON.stringify` output |

## Usage

| Element ID / Selector | Purpose |
|----------------------|---------|
| XML input textarea | XML document input |
| Convert button | Run conversion |
| JSON output textarea | Resulting JSON |
| Copy button | Copy JSON to clipboard |
| Clear button | Reset both fields |
| Status display | Success or error message |

## License

MIT
