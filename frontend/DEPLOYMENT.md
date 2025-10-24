# QuickPoll Frontend Deployment Guide

## 🚀 部署到 Vercel (推荐)

### 1. 准备工作
```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel 账户
vercel login
```

### 2. 自动部署
```bash
# 运行部署脚本
./deploy.sh
```

### 3. 手动部署
```bash
# 构建项目
npm run build

# 部署到 Vercel
vercel --prod
```

## 🔧 环境变量配置

在 Vercel Dashboard 中设置以下环境变量：

```
REACT_APP_LINERA_GRAPHQL_ENDPOINT=https://your-linera-endpoint.com
REACT_APP_LINERA_CHAIN_ID=f3315e0e3891706c835f049d3dd8a22105065e427f6e77dd013ec07dc899e164
REACT_APP_LINERA_APPLICATION_ID=940c1137174b2947278c79075d1568ba2f95b2ae23975ebd49f14f0eabc0a18d
```

## 🌐 其他部署选项

### Netlify
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 构建并部署
npm run build
netlify deploy --prod --dir=build
```

### GitHub Pages
```bash
# 安装 gh-pages
npm install --save-dev gh-pages

# 添加部署脚本到 package.json
"homepage": "https://yourusername.github.io/quickpoll",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# 部署
npm run deploy
```

## 🔐 钱包连接要求

### 本地开发
- 使用 `http://localhost:3000`
- 钱包连接正常工作

### 生产环境
- 必须使用 HTTPS
- 需要真实的 Linera 钱包扩展
- 配置正确的区块链网络

## 📱 移动端支持

部署后的应用支持：
- 响应式设计
- 移动端钱包连接
- PWA 功能（可选）

## 🚨 注意事项

1. **HTTPS 要求**: 钱包连接需要 HTTPS 环境
2. **域名配置**: 确保域名正确配置
3. **CORS 设置**: 后端需要允许前端域名
4. **环境变量**: 生产环境变量必须正确设置

## 🔄 自动部署

连接 GitHub 仓库到 Vercel 可以实现：
- 代码推送自动部署
- 分支预览
- 回滚功能

## 📊 监控和日志

- Vercel Analytics
- 错误监控
- 性能监控
- 用户行为分析
