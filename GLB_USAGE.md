# GLB 3D模型使用指南 🎨

## 下载和放置GLB文件

### 步骤1：下载GLB模型

从您使用的3D生成工具（如图所示）下载GLB格式的猫咪模型文件。

### 步骤2：重命名文件

将下载的文件重命名为 `cat.glb`

### 步骤3：放置文件

将 `cat.glb` 文件放入以下目录：

```
f:/Downloads/catcam-G/web/models/cat.glb
```

## 代码已自动适配

✅ 代码已修改完成，支持以下功能：

### 自动加载GLB模型
- 应用启动时自动尝试加载 `models/cat.glb`
- 加载进度会在浏览器控制台显示

### 智能眼睛识别
代码会自动查找模型中的眼睛部位，支持以下命名：
- `leftEye` / `rightEye`
- `left_eye` / `right_eye`
- `Left Eye` / `Right Eye`
- 包含 `eye`, `eyes`, `pupil` 等关键词

### 自动降级机制
- 如果GLB文件不存在或加载失败
- 自动使用程序化猫咪模型作为备份
- 不会中断应用运行

## 调整模型大小和位置

如果加载后模型大小或位置不合适，修改 `script.js` 第104-105行：

```javascript
// 调整模型大小和位置
catModel.scale.set(2, 2, 2);    // 修改数字调整大小（1=原始大小）
catModel.position.y = 0;        // 修改垂直位置
```

### 常见调整示例

**模型太小**：
```javascript
catModel.scale.set(5, 5, 5);  // 放大5倍
```

**模型太大**：
```javascript
catModel.scale.set(0.5, 0.5, 0.5);  // 缩小一半
```

**模型位置偏下**：
```javascript
catModel.position.y = 2;  // 向上移动
```

**模型位置偏上**：
```javascript
catModel.position.y = -1;  // 向下移动
```

## 验证步骤

### 1. 放置GLB文件后，刷新浏览器

访问 `http://localhost:8000`

### 2. 打开浏览器开发者工具（F12）

查看Console（控制台）输出：

**成功加载GLB模型**：
```
🚀 初始化应用...
🎨 初始化Three.js场景...
🐱 加载3D猫咪模型...
📦 GLB加载中: 45.3%
📦 GLB加载中: 89.7%
📦 GLB加载中: 100.0%
✅ GLB模型加载成功
🔍 找到左眼: leftEye
🔍 找到右眼: rightEye
✅ GLB猫咪模型已添加到场景
```

**GLB文件不存在（使用备用模型）**：
```
🐱 加载3D猫咪模型...
⚠️  GLB模型加载失败，使用程序化备用模型
🐱 创建程序化猫咪模型...
✅ 程序化猫咪模型创建完成
```

### 3. 测试手势跟踪

- 伸出手掌
- 移动手掌
- 观察猫咪头部是否跟随转动

## 手动指定眼睛（高级）

如果自动识别失败，您可以在Blender等3D软件中：

1. **重命名眼睛Mesh**为 `leftEye` 和 `rightEye`
2. **或者**修改 `script.js` 第112行的查找逻辑

```javascript
// 添加您的模型特定命名
const eyeNames = ['eye', 'Eye', 'eyes', 'Eyes', '眼睛', 'pupil', 'Pupil', 
                  '您的眼睛命名'];  // 添加到这里
```

## 优化建议

### 文件大小优化

推荐使用在线工具压缩GLB文件：
- [gltf.report](https://gltf.report/) - 分析和优化
- [glTF-Transform](https://gltf-transform.donmccurdy.com/) - 在线压缩

**目标大小**：< 5MB（适合移动端快速加载）

### 纹理优化

- 使用JPEG纹理替代PNG（文件更小）
- 纹理分辨率：512x512 或 1024x1024
- 避免4K纹理（移动端加载慢）

## 故障排除

| 问题 | 解决方案 |
|------|----------|
| 模型不显示 | 检查GLB文件路径是否正确 |
| 模型太小看不见 | 增大 `scale.set()` 数值 |
| 眼睛不跟随手掌 | 检查控制台是否找到leftEye/rightEye |
| 加载很慢 | 压缩GLB文件或降低纹理分辨率 |
| 模型全黑 | 检查场景光照，或模型材质问题 |

## 当前文件结构

```
f:/Downloads/catcam-G/web/
├── index.html
├── style.css
├── script.js
├── README.md
├── models/
│   └── cat.glb  ← 将您的GLB文件放在这里
└── GLB_USAGE.md (本文档)
```

---

**下一步**：将您下载的GLB文件重命名为 `cat.glb`，放入 `models/` 目录，然后刷新浏览器！🚀
