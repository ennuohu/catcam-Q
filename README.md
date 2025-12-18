# 猫咪手势跟踪 Web 应用 🐱👋

一个基于Web技术的实时手势跟踪应用，能够捕捉摄像头画面，检测手掌位置，并让3D猫咪模型跟随手的移动而转动头部和眼睛。

## 功能特性

- ✅ **实时手势检测**：使用MediaPipe Hands识别手掌位置
- ✅ **3D猫咪模型**：使用Three.js创建可爱的程序化猫咪模型
- ✅ **智能跟踪**：猫咪头部和眼睛实时跟随手掌移动
- ✅ **平滑动画**：使用插值算法实现流畅的转动效果
- ✅ **响应式设计**：支持桌面和移动端浏览器
- ✅ **零依赖**：所有库通过CDN加载，无需安装

## 技术栈

- **Three.js** - 3D图形渲染
- **MediaPipe Hands** - 手势识别
- **WebRTC getUserMedia** - 摄像头访问
- **原生 HTML/CSS/JavaScript** - 无框架依赖

## 快速开始

### 方法1：使用Python内置服务器（推荐）

```bash
# 进入web目录
cd f:/Downloads/catcam-G/web

# 启动HTTP服务器
python -m http.server 8000
```

然后在浏览器访问：`http://localhost:8000`

### 方法2：使用Node.js http-server

```bash
# 进入web目录
cd f:/Downloads/catcam-G/web

# 使用npx启动（无需安装）
npx http-server -p 8000
```

### 方法3：使用VS Code Live Server

1. 安装 Live Server 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 在手机上使用

### 方式1：局域网访问

1. 确保电脑和手机连接同一WiFi
2. 在电脑上启动HTTP服务器
3. 查找电脑IP地址：
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
4. 在手机浏览器访问：`http://[电脑IP]:8000`（例如：`http://192.168.1.100:8000`）

### 方式2：部署到云端

将 `web` 目录部署到任意静态网站托管服务：

- **GitHub Pages**：免费，支持HTTPS
- **Vercel**：一键部署，自动HTTPS
- **Netlify**：拖拽上传，即时发布

> ⚠️ **注意**：摄像头访问需要HTTPS或localhost环境

## 使用说明

1. **允许摄像头权限**：首次访问时，浏览器会请求摄像头权限，请点击"允许"
2. **伸出手掌**：将手掌放在摄像头前，应用会自动检测
3. **移动手掌**：移动手掌，观察猫咪头部和眼睛跟随转动
4. **状态指示**：页面顶部显示检测状态（绿点=已检测，红点=等待中）

## 调试模式

如需查看手势检测可视化效果，编辑 `style.css` 第85行：

```css
/* 将opacity从0改为0.3 */
#output-canvas {
    opacity: 0.3; /* 显示手势骨架 */
}
```

## 浏览器兼容性

- ✅ Chrome/Edge 90+（推荐）
- ✅ Safari 14+
- ✅ Firefox 88+
- ✅ 移动端 Chrome/Safari

## 文件结构

```
web/
├── index.html      # 主页面
├── style.css       # 样式文件
├── script.js       # 核心逻辑
└── README.md       # 本文档
```

## 常见问题

**Q: 摄像头无法访问？**  
A: 确保使用HTTPS或localhost，并在浏览器设置中允许摄像头权限。

**Q: 手势检测不准确？**  
A: 确保光线充足，手掌完整出现在画面中。可调整 `script.js` 中的 `minDetectionConfidence` 参数。

**Q: 移动端性能差？**  
A: 可以降低视频分辨率，修改 `initCamera()` 函数中的 `width/height` 参数。

**Q: 猫咪转动太快/太慢？**  
A: 调整 `updateCatLookDirection()` 函数中的 `smoothFactor` 值（0.1 = 默认）。

## 进阶自定义

### 修改猫咪颜色

编辑 `script.js` 第79-81行：

```javascript
const furMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff9966, // 修改此十六进制颜色值
    shininess: 30
});
```

### 调整检测手数量

编辑 `script.js` 第234行：

```javascript
hands.setOptions({
    maxNumHands: 2, // 改为2可同时检测双手
    ...
});
```

## 许可证

MIT License

---

**作者**：Gemini AI Assistant  
**创建日期**：2025-12-18
