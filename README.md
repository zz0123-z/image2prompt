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

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/image2prompt)

### 方法二：手动部署

1. **创建 GitHub 仓库**
   ```bash
   # 添加远程仓库（替换为你的仓库地址）
   git remote add origin https://github.com/your-username/image2prompt.git
   git branch -M main
   git push -u origin main
   ```

2. **部署到 Vercel**
   - 访问 https://vercel.com/
   - 登录你的账号
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

3. **配置项目**
   - Vercel 会自动识别项目结构
   - 前端构建命令: `npm run build`
   - 后端 API 路由: Vercel 会自动处理 `api/` 目录

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
