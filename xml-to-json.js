(function() {
    var inputEl = document.getElementById('inputArea');
    var outputEl = document.getElementById('outputArea');
    var statusEl = document.getElementById('status');
    var convertBtn = document.getElementById('convertBtn');
    var copyBtn = document.getElementById('copyBtn');
    var clearBtn = document.getElementById('clearBtn');

    function setStatus(msg, type) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className = 'code-status ' + (type || '');
    }

    function nodeToObj(node) {
        if (node.nodeType === 3) {
            return node.nodeValue.trim();
        }
        if (node.nodeType !== 1) return null;

        var obj = {};

        if (node.attributes && node.attributes.length > 0) {
            obj['@attributes'] = {};
            for (var i = 0; i < node.attributes.length; i++) {
                obj['@attributes'][node.attributes[i].name] = node.attributes[i].value;
            }
        }

        var children = node.childNodes;
        var hasElementChildren = false;
        for (var j = 0; j < children.length; j++) {
            if (children[j].nodeType === 1) { hasElementChildren = true; break; }
        }

        if (!hasElementChildren) {
            var text = node.textContent.trim();
            if (Object.keys(obj).length === 0) return text;
            if (text) obj['#text'] = text;
            return obj;
        }

        for (var k = 0; k < children.length; k++) {
            var child = children[k];
            if (child.nodeType !== 1) continue;
            var childObj = nodeToObj(child);
            var name = child.nodeName;
            if (obj[name] !== undefined) {
                if (!Array.isArray(obj[name])) obj[name] = [obj[name]];
                obj[name].push(childObj);
            } else {
                obj[name] = childObj;
            }
        }

        return obj;
    }

    function convert() {
        if (!inputEl || !outputEl) return;
        var text = inputEl.value.trim();
        if (!text) { setStatus('', ''); outputEl.value = ''; return; }
        try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, 'application/xml');
            var parseError = doc.querySelector('parsererror');
            if (parseError) {
                inputEl.classList.add('error');
                setStatus('Invalid XML: ' + parseError.textContent.split('\n')[0], 'error');
                outputEl.value = '';
                return;
            }
            var result = {};
            result[doc.documentElement.nodeName] = nodeToObj(doc.documentElement);
            outputEl.value = JSON.stringify(result, null, 2);
            inputEl.classList.remove('error');
            setStatus('XML converted to JSON successfully.', 'success');
        } catch (e) {
            inputEl.classList.add('error');
            setStatus('Error: ' + e.message, 'error');
            outputEl.value = '';
        }
    }

    if (convertBtn) convertBtn.addEventListener('click', convert);

    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            if (!outputEl || !outputEl.value) return;
            navigator.clipboard.writeText(outputEl.value).then(function() {
                var orig = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(function() { copyBtn.textContent = orig; }, 1500);
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            inputEl.value = '';
            outputEl.value = '';
            inputEl.classList.remove('error');
            setStatus('', '');
        });
    }
})();
