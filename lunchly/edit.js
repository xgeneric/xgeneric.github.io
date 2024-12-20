(function() {
    let panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '0';
    panel.style.left = '0';
    panel.style.width = '100%';
    panel.style.height = '50%';
    panel.style.backgroundColor = '#1e1e1e';
    panel.style.color = 'white';
    panel.style.zIndex = '10000';
    panel.style.borderTop = '1px solid #333';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.padding = '0';
    panel.style.boxSizing = 'border-box';
    panel.style.fontFamily = 'Consolas, "Courier New", monospace';

    let tabBar = document.createElement('div');
    tabBar.style.display = 'flex';
    tabBar.style.backgroundColor = '#333';
    tabBar.style.padding = '5px';
    tabBar.style.cursor = 'pointer';

    let elementTab = document.createElement('div');
    elementTab.innerText = 'Element';
    elementTab.style.flex = '1';
    elementTab.style.textAlign = 'center';
    elementTab.style.backgroundColor = '#444';
    elementTab.style.padding = '5px';
    elementTab.style.borderRight = '1px solid #333';
    elementTab.style.transition = 'background-color 0.3s';
    elementTab.onclick = function() {
        switchTab('element');
    };

    let consoleTab = document.createElement('div');
    consoleTab.innerText = 'Console';
    consoleTab.style.flex = '1';
    consoleTab.style.textAlign = 'center';
    consoleTab.style.backgroundColor = '#444';
    consoleTab.style.padding = '5px';
    consoleTab.style.transition = 'background-color 0.3s';
    consoleTab.onclick = function() {
        switchTab('console');
    };

    let closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = '#333';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        panel.remove();
    };

    tabBar.appendChild(elementTab);
    tabBar.appendChild(consoleTab);

    let elementContent = document.createElement('div');
    elementContent.style.display = 'block';
    elementContent.style.flexGrow = '1';
    
    let elementTextarea = document.createElement('textarea');
    elementTextarea.style.width = '100%';
    elementTextarea.style.height = '100%';
    elementTextarea.style.backgroundColor = '#252526';
    elementTextarea.style.color = 'white';
    elementTextarea.style.border = '1px solid #333';
    elementTextarea.style.padding = '10px';
    elementTextarea.style.boxSizing = 'border-box';
    elementTextarea.style.outline = 'none';
    elementTextarea.value = document.documentElement.outerHTML;
    elementContent.appendChild(elementTextarea);

    let consoleContent = document.createElement('div');
    consoleContent.style.display = 'none';
    consoleContent.style.flexGrow = '1';
    
    let consoleTextarea = document.createElement('textarea');
    consoleTextarea.style.width = '100%';
    consoleTextarea.style.height = '100%';
    consoleTextarea.style.backgroundColor = '#252526';
    consoleTextarea.style.color = 'white';
    consoleTextarea.style.border = '1px solid #333';
    consoleTextarea.style.padding = '10px';
    consoleTextarea.style.boxSizing = 'border-box';
    consoleTextarea.style.outline = 'none';
    consoleTextarea.placeholder = 'console.log("Hello World")';
    consoleContent.appendChild(consoleTextarea);

    let resizeBar = document.createElement('div');
    resizeBar.style.height = '10px';
    resizeBar.style.backgroundColor = '#444';
    resizeBar.style.cursor = 'ns-resize';
    resizeBar.style.marginTop = '10px';
    resizeBar.style.width = '100%';
    
    let isResizing = false;
    resizeBar.onmousedown = function(e) {
        isResizing = true;
        document.body.style.userSelect = 'none';
        let startY = e.clientY;
        let startHeight = panel.offsetHeight;

        document.onmousemove = function(e) {
            if (isResizing) {
                let newHeight = startHeight + (startY - e.clientY);
                if (newHeight > 100 && newHeight < window.innerHeight - 50) {
                    panel.style.height = newHeight + 'px';
                }
            }
        };

        document.onmouseup = function() {
            isResizing = false;
            document.onmousemove = null;
            document.onmouseup = null;
            document.body.style.userSelect = 'auto';
        };
    };

    panel.appendChild(tabBar);
    panel.appendChild(elementContent);
    panel.appendChild(consoleContent);
    panel.appendChild(resizeBar);
    panel.appendChild(closeButton);
    document.body.appendChild(panel);

    function switchTab(tab) {
        if (tab === 'element') {
            elementContent.style.display = 'block';
            consoleContent.style.display = 'none';
            elementTab.style.backgroundColor = '#444';
            consoleTab.style.backgroundColor = '#333';
        } else if (tab === 'console') {
            elementContent.style.display = 'none';
            consoleContent.style.display = 'block';
            consoleTab.style.backgroundColor = '#444';
            elementTab.style.backgroundColor = '#333';
        }
    }

    switchTab('element');

    elementTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            let parser = new DOMParser();
            let doc = parser.parseFromString(elementTextarea.value, 'text/html');
            let modifiedElements = doc.body.children;

            Array.from(modifiedElements).forEach(function(newElement) {
                let existingElement = document.getElementById(newElement.id);
                if (existingElement) {
                    existingElement.replaceWith(newElement);
                } else {
                    document.body.appendChild(newElement);
                }
            });
        }
    });

    consoleTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            try {
                let result = eval(consoleTextarea.value);
                consoleTextarea.value += '\n' + result + '\n';
            } catch (err) {
                consoleTextarea.value += '\n' + err.message + '\n';
            }
            consoleTextarea.value = '';
        }
    });
})();
