const textInput = document.getElementById('textInput');
const renderRoot = document.getElementById('renderRoot');
const svgConnectors = document.getElementById('svgConnectors');
const colors = ['#f87171', '#fbbf24', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6'];

function parseText(text) {
    const lines = text.split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return null;

    const root = { text: lines[0].replace(/\\n/g, '\n'), children: [] };
    let currentLevel1 = null;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const content = line.trim().substring(2).replace(/\\n/g, '\n');

        if (line.startsWith('- ')) {
            currentLevel1 = { text: content, children: [], id: `l1-${root.children.length}` };
            root.children.push(currentLevel1);
        } else if (line.startsWith('  - ')) {
            if (currentLevel1) {
                currentLevel1.children.push({ text: content });
            }
        }
    }
    return root;
}

function renderMindMap() {
    const data = parseText(textInput.value);
    if (!data) return;

    // 清空舊內容
    renderRoot.innerHTML = '';
    svgConnectors.innerHTML = '';

    // 建立 Root
    const rootNode = document.createElement('div');
    rootNode.className = 'node node-root mb-20';
    rootNode.textContent = data.text;
    rootNode.id = 'root-node';
    renderRoot.appendChild(rootNode);

    // 建立 Level 1 Container (Horizontal)
    const l1Container = document.createElement('div');
    l1Container.className = 'flex justify-center gap-12 w-full px-10 items-start';
    renderRoot.appendChild(l1Container);

    data.children.forEach((child, index) => {
        const column = document.createElement('div');
        column.className = 'flex flex-col items-center flex-1 max-w-[250px]';

        // L1 Node
        const l1Node = document.createElement('div');
        l1Node.className = `node node-level1 color-${index % 4}`;
        l1Node.textContent = child.text;
        l1Node.id = `node-l1-${index}`;
        column.appendChild(l1Node);

        // L2 Container (Vertical)
        if (child.children.length > 0) {
            const l2List = document.createElement('div');
            l2List.className = 'mt-10 flex flex-col items-center gap-4 w-full';

            child.children.forEach((subChild, subIndex) => {
                const l2Node = document.createElement('div');
                l2Node.className = 'node node-level2';
                l2Node.textContent = subChild.text;
                l2Node.id = `node-l1-${index}-l2-${subIndex}`;
                l2List.appendChild(l2Node);
            });
            column.appendChild(l2List);
        }

        l1Container.appendChild(column);
    });

    // 等待 DOM 渲染完畢後繪製線條
    requestAnimationFrame(() => {
        drawConnectors(data);
    });
}

function drawConnectors(data) {
    const rootBox = document.getElementById('root-node').getBoundingClientRect();
    const containerBox = document.getElementById('captureArea').getBoundingClientRect();

    const rootX = (rootBox.left + rootBox.right) / 2 - containerBox.left;
    const rootY = rootBox.bottom - containerBox.top;

    data.children.forEach((child, index) => {
        const l1El = document.getElementById(`node-l1-${index}`);
        const l1Box = l1El.getBoundingClientRect();
        const l1X = (l1Box.left + l1Box.right) / 2 - containerBox.left;
        const l1Y = l1Box.top - containerBox.top;

        // 繪製 Root 到 L1 的曲線
        const color = colors[index % colors.length];
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        // Bezier 曲線路徑
        const midY = rootY + (l1Y - rootY) * 0.5;
        const d = `M ${rootX} ${rootY} C ${rootX} ${midY}, ${l1X} ${midY}, ${l1X} ${l1Y}`;

        path.setAttribute('d', d);
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', '4');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        svgConnectors.appendChild(path);

        // 繪製 L1 到 L2 的直線
        let prevY = l1Box.bottom - containerBox.top;
        child.children.forEach((sub, subIndex) => {
            const l2El = document.getElementById(`node-l1-${index}-l2-${subIndex}`);
            const l2Box = l2El.getBoundingClientRect();
            const l2X = (l2Box.left + l2Box.right) / 2 - containerBox.left;
            const l2TopY = l2Box.top - containerBox.top;
            const l2BottomY = l2Box.bottom - containerBox.top;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', l2X);
            line.setAttribute('y1', prevY);
            line.setAttribute('x2', l2X);
            line.setAttribute('y2', l2TopY);
            line.setAttribute('stroke', color);
            line.setAttribute('stroke-width', '2');
            svgConnectors.appendChild(line);

            prevY = l2BottomY;
        });
    });
}

// 事件監聽
textInput.addEventListener('input', renderMindMap);
window.addEventListener('resize', renderMindMap);

// 初始渲染
window.onload = renderMindMap;
