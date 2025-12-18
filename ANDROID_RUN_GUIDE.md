# 📱 如何在 Android 手机上运行本项目

是的，**所有项目文件都在 `web` 文件夹下**。该文件夹是完整的独立网站包。

但是，由于涉及**摄像头权限**，浏览器出于安全考虑，要求必须在 **安全环境 (HTTPS 或 localhost)** 下才能开启摄像头。

❌ **直接访问 IP (如 http://192.168.1.5:8000) 通常无法打开摄像头**。

推荐以下两种方法：

## 方法一：USB 数据线连接 (推荐开发者使用)
这是最快的方法，利用 Chrome 的端口转发功能，让手机认为自己在访问 localhost。

1. **手机开启 USB 调试**：
   - 手机连接电脑，开启“开发者模式”并启用“USB 调试”。
2. **电脑 Chrome 设置**：
   - 在电脑 Chrome 地址栏输入：`chrome://inspect/#devices`
   - 勾选 **Discover USB devices**。
   - 点击 **Port forwarding...** 按钮。
   - 添加规则：
     - Port: `8000`
     - IP and Port: `localhost:8000`
   - 点击 **Enable port forwarding** 并勾选。
3. **手机访问**：
   - 保持手机连接电脑。
   - 在手机 Chrome 浏览器中直接访问：`http://localhost:8000`
   - 此时手机会像电脑一样把它当作本地安全页面，允许开启摄像头。

---

## 方法二：部署到服务器 (推荐分享使用)
将 `web` 文件夹上传到免费的静态托管服务，自动获得 HTTPS 链接。

**使用 Vercel (最简单):**
1. 安装 Vercel CLI: `npm i -g vercel` (或直接去 vercel.com 网页上传)
2. 在 `web` 文件夹下运行命令: `vercel deploy`
3. 一路回车，它会生成一个 `https://your-project.vercel.app` 的链接。
4. 发送这个链接给手机，即可直接访问。

**使用 GitHub Pages:**
1. 将 `web` 文件夹内容推送到 GitHub 仓库。
2. 在仓库 Settings -> Pages 中开启服务。
3. 获取 HTTPS 链接。

---

## 📂 文件结构确认
您的 `web` 文件夹是完整的：
- `index.html`: 主程序
- `style.css`: 样式
- `models/`: 模型文件夹
- `GLTFLoader.js` 等: 依赖库

您只需将整个 `web` 文件夹的内容视为一个完整且独立的网站即可。
