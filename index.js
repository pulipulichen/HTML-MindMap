import React, { useState, useEffect, useRef } from 'react';
import { Download, Layout, Edit3, Image as ImageIcon, Copy, CheckCircle2 } from 'lucide-react';

const App = () => {
  const [inputText, setInputText] = useState(`訪談分析
- 實作：\\n訪談轉錄
  - 訪談準備
  - 開啟轉錄
  - 完成轉錄
- 資料分析\\n與RAG
  - 語音轉錄的限制
  - 檢索增強生成RAG
  - Google\\nNotebookLM
- 實作：\\n用RAG分析訪談
  - 建立筆記本
  - 訪談分析提示詞
  - 觀察分析結果`);

  const [treeData, setTreeData] = useState(null);
  const [message, setMessage] = useState('');
  const svgRef = useRef(null);

  // 顯示自定義訊息訊息框
  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // 解析縮排文字為樹狀結構
  const parseTextToTree = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return null;

    const root = { name: lines[0].trim().replace(/\\n/g, '\n'), children: [], level: 0 };
    const stack = [root];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const content = line.trim().replace(/^-\s*/, '').replace(/\\n/g, '\n');
      
      let level = 1;
      const indentMatch = line.match(/^(\s*)/);
      const indentLength = indentMatch ? indentMatch[1].length : 0;
      
      if (indentLength >= 4) level = 2;
      else if (indentLength >= 2) level = 1;
      else level = 1; 

      const node = { name: content, children: [], level: level + 1 };

      while (stack.length > level + 1) {
        stack.pop();
      }

      if (stack[stack.length - 1]) {
        stack[stack.length - 1].children.push(node);
        stack.push(node);
      }
    }
    return root;
  };

  useEffect(() => {
    setTreeData(parseTextToTree(inputText));
  }, [inputText]);

  const colors = ['#FF7654', '#FFB800', '#6ED35B', '#4D96FF', '#A076FF'];

  // 通用的 PNG 生成邏輯 (可選背景顏色)
  const generatePNG = (transparent = true) => {
    return new Promise((resolve) => {
      const svg = svgRef.current;
      // 複製一個 SVG 來操作，避免移除背景矩形影響預覽
      const svgClone = svg.cloneNode(true);
      if (transparent) {
        const bgRect = svgClone.querySelector('rect[fill="#ffffff"]');
        if (bgRect) bgRect.setAttribute('fill-opacity', '0');
      }

      const svgData = new XMLSerializer().serializeToString(svgClone);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgSize = svg.getBoundingClientRect();
      const scale = 2; // 高解析度
      canvas.width = svgSize.width * scale;
      canvas.height = svgSize.height * scale;
      
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        if (!transparent) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.src = url;
    });
  };

  // 下載為圖片 (透明背景)
  const downloadImage = async () => {
    const canvas = await generatePNG(true);
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'mindmap_transparent.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    showToast('已成功下載透明背景圖片！');
  };

  // 複製到剪貼簿 (透明背景)
  const copyImageToClipboard = async () => {
    try {
      const canvas = await generatePNG(true);
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const data = [new ClipboardItem({ 'image/png': blob })];
            await navigator.clipboard.write(data);
            showToast('已複製透明背景圖片至剪貼簿！');
          } catch (err) {
            console.error(err);
            showToast('複製失敗，請嘗試使用下載功能。');
          }
        }
      }, 'image/png');
    } catch (err) {
      showToast('處理圖片時出錯。');
    }
  };

  const renderTree = () => {
    if (!treeData) return null;

    const lineElements = [];
    const nodeElements = [];
    
    const centerX = 500;
    const rootY = 50;
    const nodeWidth = 180;
    const nodeHeight = 60;
    const level1Y = 250;
    const level2StartY = 380;
    const siblingSpacing = 280;

    // 1. 根節點
    nodeElements.push(
      <g key="root">
        <rect
          x={centerX - nodeWidth / 2}
          y={rootY}
          width={nodeWidth}
          height={nodeHeight}
          rx="10"
          fill="white"
          stroke="#CBD5E1"
          strokeWidth="1"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}
        />
        <text
          x={centerX}
          y={rootY + nodeHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#1E293B"
          className="font-bold"
          style={{ fontSize: '24px', fontFamily: 'system-ui, sans-serif' }}
        >
          {treeData.name}
        </text>
      </g>
    );

    // 2. 主幹
    const trunkEndPointY = rootY + nodeHeight + 20;
    lineElements.push(
      <line
        key="trunk"
        x1={centerX}
        y1={rootY + nodeHeight}
        x2={centerX}
        y2={trunkEndPointY}
        stroke="#6ED35B"
        strokeWidth="6"
        strokeLinecap="round"
      />
    );

    // 3. 子節點
    treeData.children.forEach((child, i) => {
      const childX = centerX + (i - (treeData.children.length - 1) / 2) * siblingSpacing;
      const color = colors[i % colors.length];

      lineElements.push(
        <path
          key={`line-l1-${i}`}
          d={`M ${centerX} ${trunkEndPointY} C ${centerX} ${level1Y - 60}, ${childX} ${level1Y - 60}, ${childX} ${level1Y}`}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />
      );

      const lines = child.name.split('\n');
      nodeElements.push(
        <g key={`node-l1-${i}`}>
          <rect
            x={childX - 75}
            y={level1Y}
            width={150}
            height={60}
            rx="10"
            fill="white"
            stroke={color}
            strokeWidth="3"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}
          />
          <text
            x={childX}
            y={level1Y + 30 - (lines.length - 1) * 11}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1E293B"
            className="font-bold"
            style={{ fontSize: '18px', fontFamily: 'system-ui, sans-serif' }}
          >
            {lines.map((line, idx) => (
              <tspan x={childX} dy={idx === 0 ? 0 : 22} key={idx}>{line}</tspan>
            ))}
          </text>
        </g>
      );

      child.children.forEach((subChild, j) => {
        const subY = level2StartY + j * 80;
        lineElements.push(
          <line
            key={`line-l2-${i}-${j}`}
            x1={childX}
            y1={j === 0 ? level1Y + 60 : level2StartY + (j - 1) * 80 + 20}
            x2={childX}
            y2={subY}
            stroke={color}
            strokeWidth="2"
            opacity="0.4"
          />
        );

        const subLines = subChild.name.split('\n');
        nodeElements.push(
          <g key={`node-l2-${i}-${j}`}>
            <text
              x={childX}
              y={subY + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#64748b"
              style={{ fontSize: '16px', fontFamily: 'system-ui, sans-serif' }}
            >
              {subLines.map((line, idx) => (
                <tspan x={childX} dy={idx === 0 ? 0 : 22} key={idx}>{line}</tspan>
              ))}
            </text>
          </g>
        );
      });
    });

    return [...lineElements, ...nodeElements];
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white overflow-hidden relative">
      {/* Toast Message */}
      {message && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} />
          <span className="font-medium">{message}</span>
        </div>
      )}

      <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Layout size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">垂直心智圖繪製工具</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyImageToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-full font-medium"
          >
            <Copy size={18} />
            複製 PNG (透明)
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-full font-medium shadow-lg shadow-blue-900/20"
          >
            <Download size={18} />
            下載 PNG
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-neutral-800 flex flex-col bg-neutral-950">
          <div className="p-4 border-b border-neutral-800 flex items-center gap-2 text-neutral-400">
            <Edit3 size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">編輯文字內容</span>
          </div>
          <div className="p-4 flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full bg-transparent text-neutral-200 font-mono text-sm leading-relaxed focus:outline-none resize-none"
              placeholder="輸入心智圖內容..."
            />
          </div>
          <div className="p-4 bg-neutral-900/50 text-xs text-neutral-500 italic">
            提示：使用 - 來縮排表示層級，支援 \n 換行。
          </div>
        </div>

        <div className="flex-1 bg-neutral-200 relative overflow-auto flex items-center justify-center p-12">
          <div className="bg-white rounded-xl border border-neutral-300 shadow-2xl overflow-hidden min-w-[1000px] min-h-[800px]">
            <svg
              ref={svgRef}
              viewBox="0 0 1000 800"
              width="1000"
              height="800"
              className="w-full h-auto"
            >
              {/* 預覽背景保持白色 */}
              <rect width="1000" height="800" fill="#ffffff" />
              {renderTree()}
            </svg>
          </div>
          <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg text-xs text-neutral-600 backdrop-blur-sm border border-neutral-200 shadow-sm">
            <ImageIcon size={14} />
            畫布預覽 (白底)
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;