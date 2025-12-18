// ==========================================
// 猫咪手势跟踪应用 - 主逻辑
// ==========================================

// 全局变量
let camera, scene, renderer, catModel;
let hands, cameraUtils;
let videoElement, canvasElement, canvasCtx;
let handDetected = false;
let handPosition = { x: 0, y: 0, z: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };

// ==========================================
// 初始化应用
// ==========================================
async function init() {
    console.log('🚀 初始化应用...');

    // 检查依赖库是否加载
    if (typeof THREE === 'undefined') {
        console.error('❌ THREE.js未加载！');
        alert('Three.js库加载失败，请刷新页面重试');
        return;
    }
    console.log('✅ THREE.js已加载，版本:', THREE.REVISION);

    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('❌ GLTFLoader未加载！');
        alert('GLTFLoader库加载失败，将使用程序化模型');
    } else {
        console.log('✅ GLTFLoader已加载');
    }

    if (typeof Hands === 'undefined') {
        console.error('❌ MediaPipe Hands未加载！');
        alert('MediaPipe库加载失败，请检查网络连接');
        return;
    }
    console.log('✅ MediaPipe Hands已加载');

    // 初始化Three.js场景
    initThreeJS();

    // 初始化摄像头和MediaPipe
    await initCamera();
    await initMediaPipe();

    // 开始渲染循环
    animate();

    // 隐藏加载界面
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('app').classList.add('active');

    console.log('✅ 应用初始化完成');
}

// ==========================================
// Three.js 场景初始化
// ==========================================
function initThreeJS() {
    console.log('🎨 初始化Three.js场景...');

    const container = document.getElementById('scene-container');

    // 创建场景
    scene = new THREE.Scene();
    scene.background = null; // 透明背景

    // 创建相机
    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 8;

    // 创建渲染器
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 添加光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff9999, 0.5);
    pointLight.position.set(-5, 3, 3);
    scene.add(pointLight);

    // 创建3D猫咪模型
    createCatModel();

    // 窗口大小调整
    window.addEventListener('resize', onWindowResize, false);
}

// ==========================================
// 创建3D猫咪模型
// ==========================================
function createCatModel() {
    console.log('🐱 加载3D猫咪模型...');

    // 尝试加载GLB模型
    const loader = new THREE.GLTFLoader();

    loader.load(
        'models/cat.glb', // GLB文件路径

        // 加载成功回调
        function (gltf) {
            console.log('✅ GLB模型加载成功');
            catModel = gltf.scene;

            // 调整模型大小和位置
            catModel.scale.set(2, 2, 2); // 根据实际模型大小调整
            catModel.position.y = 0;

            // 自动查找眼睛部位（尝试常见命名）
            const eyeNames = ['eye', 'Eye', 'eyes', 'Eyes', '眼睛', 'pupil', 'Pupil'];
            catModel.traverse((child) => {
                if (child.isMesh) {
                    const name = child.name.toLowerCase();
                    // 查找左眼
                    if (name.includes('left') && eyeNames.some(eye => name.includes(eye.toLowerCase()))) {
                        child.name = 'leftEye';
                        console.log('🔍 找到左眼:', child.name);
                    }
                    // 查找右眼
                    if (name.includes('right') && eyeNames.some(eye => name.includes(eye.toLowerCase()))) {
                        child.name = 'rightEye';
                        console.log('🔍 找到右眼:', child.name);
                    }
                }
            });

            scene.add(catModel);
            console.log('✅ GLB猫咪模型已添加到场景');
        },

        // 加载进度回调
        function (xhr) {
            const percent = (xhr.loaded / xhr.total * 100).toFixed(1);
            console.log(`📦 GLB加载中: ${percent}%`);
        },

        // 加载失败回调 - 使用程序化模型
        function (error) {
            console.warn('⚠️  GLB模型加载失败，使用程序化备用模型');
            console.error(error);
            createProceduralCatModel();
        }
    );
}

// ==========================================
// 创建程序化猫咪模型（备用方案）
// ==========================================
function createProceduralCatModel() {
    console.log('🐱 创建程序化猫咪模型...');

    catModel = new THREE.Group();

    // 材质
    const furMaterial = new THREE.MeshPhongMaterial({
        color: 0xff9966,
        shininess: 30
    });
    const noseMaterial = new THREE.MeshPhongMaterial({
        color: 0xff6b9d,
        shininess: 50
    });
    const eyeWhiteMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    const pupilMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a1a1a
    });

    // 头部（球体）
    const headGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const head = new THREE.Mesh(headGeometry, furMaterial);
    head.scale.set(1, 0.95, 0.9);
    catModel.add(head);

    // 左耳（锥体）
    const earGeometry = new THREE.ConeGeometry(0.4, 0.8, 8);
    const leftEar = new THREE.Mesh(earGeometry, furMaterial);
    leftEar.position.set(-0.7, 1.0, 0.1);
    leftEar.rotation.z = -0.3;
    catModel.add(leftEar);

    // 右耳
    const rightEar = new THREE.Mesh(earGeometry, furMaterial);
    rightEar.position.set(0.7, 1.0, 0.1);
    rightEar.rotation.z = 0.3;
    catModel.add(rightEar);

    // 左眼（组）
    const leftEyeGroup = new THREE.Group();
    const eyeWhiteGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    leftEyeGroup.add(leftEyeWhite);

    const pupilGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    leftPupil.position.z = 0.18;
    leftEyeGroup.add(leftPupil);
    leftEyeGroup.name = 'leftEye';

    leftEyeGroup.position.set(-0.5, 0.3, 0.8);
    catModel.add(leftEyeGroup);

    // 右眼
    const rightEyeGroup = new THREE.Group();
    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    rightEyeGroup.add(rightEyeWhite);

    const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    rightPupil.position.z = 0.18;
    rightEyeGroup.add(rightPupil);
    rightEyeGroup.name = 'rightEye';

    rightEyeGroup.position.set(0.5, 0.3, 0.8);
    catModel.add(rightEyeGroup);

    // 鼻子（小球体）
    const noseGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, -0.1, 1.1);
    nose.scale.set(0.7, 0.6, 0.5);
    catModel.add(nose);

    // 胡须（线条）
    const whiskerMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
    const whiskerPoints = [
        [new THREE.Vector3(-0.3, -0.2, 1.0), new THREE.Vector3(-1.5, -0.1, 1.0)],
        [new THREE.Vector3(-0.3, -0.3, 1.0), new THREE.Vector3(-1.5, -0.3, 1.0)],
        [new THREE.Vector3(0.3, -0.2, 1.0), new THREE.Vector3(1.5, -0.1, 1.0)],
        [new THREE.Vector3(0.3, -0.3, 1.0), new THREE.Vector3(1.5, -0.3, 1.0)]
    ];

    whiskerPoints.forEach(points => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const whisker = new THREE.Line(geometry, whiskerMaterial);
        catModel.add(whisker);
    });

    // 身体（椭球体）
    const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
    const body = new THREE.Mesh(bodyGeometry, furMaterial);
    body.position.set(0, -2, 0);
    body.scale.set(1.1, 1.3, 0.9);
    catModel.add(body);

    // 添加到场景
    catModel.position.y = 0.5;
    scene.add(catModel);

    console.log('✅ 程序化猫咪模型创建完成');
}


// ==========================================
// 摄像头初始化
// ==========================================
async function initCamera() {
    console.log('📹 初始化摄像头...');

    videoElement = document.getElementById('webcam');
    canvasElement = document.getElementById('output-canvas');
    canvasCtx = canvasElement.getContext('2d');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user', // 前置摄像头
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        videoElement.srcObject = stream;

        await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                resolve();
            };
        });

        console.log('✅ 摄像头初始化成功');
    } catch (error) {
        console.error('❌ 摄像头访问失败:', error);
        alert('无法访问摄像头，请检查权限设置');
    }
}

// ==========================================
// MediaPipe Hands 初始化
// ==========================================
async function initMediaPipe() {
    console.log('👋 初始化MediaPipe Hands...');

    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1, // 只检测1只手
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onHandResults);

    // 启动摄像头处理
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720
    });
    camera.start();

    console.log('✅ MediaPipe Hands初始化成功');
}

// ==========================================
// MediaPipe 结果处理
// ==========================================
function onHandResults(results) {
    // 清空canvas
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // 检测到手掌
        const landmarks = results.multiHandLandmarks[0];

        // 绘制手势（可选，用于调试）
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });

        // 获取手掌中心位置（landmark 9：中指掌骨关节）
        const palmCenter = landmarks[9];

        // 转换坐标到屏幕空间
        // MediaPipe返回归一化坐标 [0,1]
        // X需要翻转以匹配前置摄像头镜像效果
        handPosition.x = (1 - palmCenter.x) * 2 - 1; // 转换到[-1, 1]
        handPosition.y = -(palmCenter.y * 2 - 1); // 翻转Y轴
        handPosition.z = -palmCenter.z; // Z深度

        handDetected = true;
        updateStatus(true);

        // 计算猫咪应该看向的方向
        updateCatLookDirection();
    } else {
        // 未检测到手掌
        handDetected = false;
        updateStatus(false);
    }

    canvasCtx.restore();
}

// ==========================================
// 更新猫咪看向方向
// ==========================================
function updateCatLookDirection() {
    if (!catModel) return;

    // 根据手的位置计算目标旋转角度
    // 手在左边，猫向左转；手在右边，猫向右转
    targetRotation.y = handPosition.x * 0.5; // 左右旋转（Yaw）
    targetRotation.x = handPosition.y * 0.3; // 上下旋转（Pitch）

    // 平滑过渡（插值）
    const smoothFactor = 0.1;
    currentRotation.x += (targetRotation.x - currentRotation.x) * smoothFactor;
    currentRotation.y += (targetRotation.y - currentRotation.y) * smoothFactor;

    // 应用旋转
    catModel.rotation.y = currentRotation.y;
    catModel.rotation.x = currentRotation.x;

    // 让眼睛也跟随（额外的眼球转动）
    const leftEye = catModel.getObjectByName('leftEye');
    const rightEye = catModel.getObjectByName('rightEye');

    if (leftEye && rightEye) {
        const eyeRotation = handPosition.x * 0.3;
        leftEye.rotation.y = eyeRotation;
        rightEye.rotation.y = eyeRotation;
    }
}

// ==========================================
// 更新状态显示
// ==========================================
function updateStatus(detected) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('status-text');

    if (detected) {
        statusDot.classList.add('active');
        statusText.textContent = '👋 检测到手掌';
    } else {
        statusDot.classList.remove('active');
        statusText.textContent = '等待检测手掌...';
    }
}

// ==========================================
// 渲染循环
// ==========================================
function animate() {
    requestAnimationFrame(animate);

    // 如果检测到手，持续更新猫咪方向
    if (handDetected) {
        updateCatLookDirection();
    } else {
        // 无手时，缓慢回到默认位置
        currentRotation.x *= 0.95;
        currentRotation.y *= 0.95;
        catModel.rotation.x = currentRotation.x;
        catModel.rotation.y = currentRotation.y;
    }

    // 添加轻微的呼吸动画
    const time = Date.now() * 0.001;
    if (catModel) {
        catModel.position.y = 0.5 + Math.sin(time * 2) * 0.05;
    }

    renderer.render(scene, camera);
}

// ==========================================
// 窗口调整
// ==========================================
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==========================================
// 启动应用
// ==========================================
window.addEventListener('load', init);
