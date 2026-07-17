# Image2Prompt 🖼️→📝

AI图像反推提示词工具 - 上传图片，获取专业的Midjourney提示词

## ✨ 功能特点

- **多平台支持**: 支持 Google Gemini、阿里云通义千问、DeepSeek、智谱AI 四种AI服务
- **两种上传方式**: 本地拖拽上传 / 粘贴图片URL远程加载
- **智能分析**: 自动分析图片的构图、光线、风格
- **一键生成**: 基于分析结果生成完整的Midjourney提示词
- **密钥管理**: 用户自行管理API密钥，安全存储在本地
- **优雅UI**: 浅蓝主题，玻璃态设计，响应式布局

## 🔧 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Express + TypeScript
- **图标**: Lucide React

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5174/

### 生产构建

```bash
npm run build
```

## 🔑 API密钥配置

1. 访问对应的API提供商获取密钥：
   - **Google Gemini**: https://aistudio.google.com/
   - **阿里云通义千问**: https://dashscope.console.aliyun.com/
   - **DeepSeek**: https://platform.deepseek.com/
   - **智谱AI**: https://open.bigmodel.cn/

2. 在工具中输入密钥并点击"保存密钥"

3. 点击"验证密钥"确认密钥有效

## 📦 部署到 Vercel（推荐）

### 方法一：一键部署

点击下方按钮一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zz0123-z/image2prompt)

点击按钮后，会自动跳转到 Vercel，按照提示操作即可完成部署。

---

### 方法二：手动部署（详细步骤）

#### 第一步：推送代码到 GitHub

确保代码已经推送到 GitHub 仓库：

```bash
# 查看当前远程仓库配置
git remote -v

# 如果没有配置远程仓库，执行以下命令（替换为你的仓库地址）
git remote add origin https://github.com/zz0123-z/image2prompt.git
git branch -M main
git push -u origin main
```

#### 第二步：登录 Vercel

1. 打开浏览器，访问 https://vercel.com/
2. 点击右上角的 **Sign In** 按钮
3. 使用你的 GitHub 账号登录（点击 **Continue with GitHub**）

#### 第三步：创建新项目

1. 登录成功后，点击页面中间的 **New Project** 按钮
2. 在 **Import Git Repository** 页面，找到你的 `image2prompt` 仓库
3. 点击仓库名称旁边的 **Import** 按钮

#### 第四步：配置项目设置

在项目配置页面：

1. **Project Name**: 默认即可（如 `image2prompt`）
2. **Framework**: Vercel 会自动识别为 `Vite`
3. **Build Command**: 保持默认（`npm run build`）
4. **Output Directory**: 保持默认（`dist`）

点击 **Deploy** 按钮开始部署。

#### 第五步：配置 Node.js 版本（重要！）

由于当前项目需要 Node.js 22.x 版本，需要进行以下配置：

1. **进入项目设置页面**：
   - 部署完成后，点击项目名称进入项目详情页
   - 在左侧菜单栏中找到并点击 **Settings**

2. **找到 Node.js 版本设置**：
   - 在 Settings 页面中，找到 **General** 部分
   - 向下滚动，找到 **Node.js Version** 选项

3. **选择正确的版本**：
   - 点击版本选择框
   - 选择 **22.x**（不要选择 24.x，目前不支持）
   - 点击 **Save** 按钮保存设置

#### 第六步：重新部署

配置完成后，需要重新部署项目：

1. 在项目详情页，点击顶部的 **Deployments** 标签
2. 在部署列表中，找到最新的部署记录
3. 点击右侧的 **⋯** 按钮，选择 **Redeploy**
4. 在弹出的确认窗口中，点击 **Redeploy** 按钮

等待部署完成（约1-2分钟）。

#### 第七步：验证部署

部署成功后：

1. 点击 **Visit** 按钮打开网站
2. 测试网站功能：
   - 输入 API 密钥
   - 上传图片进行分析
   - 验证结果是否正常显示

---

### 常见问题排查

#### ❌ 问题：Build Failed - Node.js Version 错误

**错误信息**：
```
Found invalid Node.js Version: "24.x". 
Please set Node.js Version to 22.x in your Project Settings.
```

**解决方案**：
按照上述 **第五步** 的说明，在 Vercel 设置中选择 Node.js 22.x 版本，然后重新部署。

#### ❌ 问题：网站无法访问（ERR_CONNECTION_TIMED_OUT）

**可能原因**：
- Vercel 部署区域问题
- 网络连接问题

**解决方案**：
1. 检查网络连接是否正常
2. 尝试使用不同的浏览器
3. 清除浏览器缓存后重新加载
4. 在 Vercel 设置中，将部署区域改为 **Hong Kong** 或 **Singapore**

#### ❌ 问题：API 请求失败

**可能原因**：
- API 密钥无效
- API 提供商服务异常
- 网络连接问题

**解决方案**：
1. 在网站上点击 **验证密钥** 按钮验证密钥是否有效
2. 检查 API 提供商的控制台，确认密钥状态和额度
3. 尝试切换到其他 API 提供商（如阿里云通义千问）

---

### Vercel 部署环境信息

| 项目 | 说明 |
|------|------|
| **平台** | Vercel（https://vercel.com/） |
| **服务器类型** | Serverless Functions（无服务器函数） |
| **前端托管** | Vercel Edge Network（全球CDN加速） |
| **后端运行时** | @vercel/node（Node.js 22.x） |
| **构建命令** | npm run build |
| **输出目录** | dist/ |

---

### 项目结构说明

```
image2prompt/
├── api/                  # 后端代码（部署为Vercel Serverless Functions）
│   ├── routes/           # API路由
│   │   ├── analyze.ts    # 图像分析API（核心功能）
│   │   └── auth.ts       # 认证API（预留）
│   ├── app.ts            # Express应用配置
│   ├── index.ts          # Vercel部署入口
│   └── server.ts         # 本地开发服务器
├── src/                  # 前端代码
│   ├── pages/            # 页面组件
│   │   └── Home.tsx      # 主页面
│   ├── components/       # 通用组件
│   ├── hooks/            # 自定义Hooks
│   ├── lib/              # 工具函数
│   ├── App.tsx           # 应用根组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── public/               # 静态资源
├── vercel.json           # Vercel配置文件
├── package.json          # 项目依赖和脚本
├── .nvmrc                # Node.js版本约束
└── README.md             # 项目说明文档
```

## 📝 使用说明

1. 在顶部输入框中输入你的API密钥
2. 选择API提供商（推荐阿里云通义千问，国内直连）
3. 上传图片或输入图片URL
4. 点击"开始分析"按钮
5. 等待分析完成，查看构图、光线、风格分析结果
6. 复制生成的完整提示词使用

## 🔒 安全说明

- 🔐 API密钥仅存储在浏览器本地（localStorage），不会上传到服务器
- 💸 所有API调用费用及额度消耗完全由用户自行承担
- ⚠️ 请妥善保管您的API密钥，不要分享给他人
- 🚫 本工具不会记录或存储用户的API密钥和图片内容

## 📄 许可证

MIT License
