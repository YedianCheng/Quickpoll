# 🗳️ QuickPoll - 基于 Linera 区块链的投票系统

一个完整的区块链投票系统，支持创建投票、投票、解决投票等功能。

## 🎯 项目概述

QuickPoll 是一个基于 Linera 区块链的投票系统，使用 Rust 开发智能合约，React 构建前端界面。系统支持预测市场、治理投票、民意调查等场景。

## 🏗️ 项目结构

```
quickpoll/
├── src/                    # Rust 后端代码
│   ├── lib.rs             # ABI 定义
│   ├── state.rs           # 数据结构和状态
│   ├── contract.rs        # 智能合约逻辑
│   └── service.rs         # GraphQL 服务
├── frontend/              # React 前端
│   ├── src/
│   │   ├── App.tsx        # 主应用组件
│   │   └── index.tsx      # 应用入口
│   ├── package.json       # 前端依赖
│   └── README.md          # 前端说明
├── examples/              # 演示程序
│   ├── demo.rs           # 简单演示
│   ├── simple_demo.rs    # 详细演示
│   └── terminal_demo.rs  # 非交互式终端演示
├── tests/                # 测试文件
│   └── single_chain.rs   # 集成测试
├── Cargo.toml           # Rust 依赖
└── README.md            # 项目说明
```

## 🚀 快速开始

### 后端（Rust）

#### 1. 运行测试
```bash
# 运行所有测试
cargo test

# 运行单元测试
cargo test --lib

# 运行集成测试
cargo test --test single_chain
```

#### 2. 运行演示
```bash
# 非交互式演示（推荐）
cargo run --example terminal_demo

# 简单演示
cargo run --example demo

# 详细演示
cargo run --example simple_demo
```

### 前端（React）

#### 1. 安装依赖
```bash
cd frontend
npm install
```

#### 2. 启动开发服务器
```bash
npm start
```

应用将在 http://localhost:3000 打开

#### 3. 构建生产版本
```bash
npm run build
```

## 🎯 功能特性

### 核心功能
- **创建投票** - 用户可以创建新的投票问题
- **投票** - 用户可以对投票进行赞成/反对投票
- **解决投票** - 管理员可以设置正确答案并结束投票
- **查看投票列表** - 实时显示所有投票的状态和结果

### 技术特点
- **基于 Linera 区块链** - 使用 Linera SDK 开发
- **GraphQL 支持** - 提供 GraphQL 查询接口
- **类型安全** - Rust 和 TypeScript 双重类型安全
- **异步处理** - 支持异步操作
- **现代化 UI** - React + Tailwind CSS 构建

## 🛠️ 技术栈

### 后端
- **Rust** - 系统编程语言
- **Linera SDK** - 区块链开发框架
- **async-graphql** - GraphQL 支持
- **serde** - 序列化/反序列化

### 前端
- **React 18** - 用户界面库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Create React App** - 构建工具

## 📱 界面预览

### Web 前端
- 现代化的响应式设计
- 直观的投票管理界面
- 实时投票结果显示
- 支持桌面和移动设备

### 终端演示
- 非交互式演示（推荐）
- 自动展示所有功能
- 适合了解系统功能

## 🧪 测试

### 运行所有测试
```bash
cargo test
```

### 测试覆盖
- **单元测试** - 合约逻辑测试
- **集成测试** - 端到端测试
- **前端测试** - React 组件测试

## 🚀 部署

### 后端部署
1. 构建 Rust 项目
2. 部署到 Linera 测试网
3. 配置 GraphQL 服务

### 前端部署
1. 构建 React 应用：`npm run build`
2. 部署到静态托管服务
3. 配置环境变量

## 📝 使用场景

- **社区治理投票** - 社区决策投票
- **预测市场** - 用户可以预测事件结果
- **民意调查** - 收集公众意见
- **决策支持系统** - 帮助组织做出决策

## 🔧 开发说明

### 后端开发
1. 修改 `src/contract.rs` 添加新的合约逻辑
2. 更新 `src/state.rs` 修改数据结构
3. 在 `src/service.rs` 中添加 GraphQL 查询
4. 运行 `cargo test` 确保测试通过

### 前端开发
1. 修改 `frontend/src/App.tsx` 更新界面
2. 在 `frontend/src/App.css` 中添加自定义样式
3. 运行 `npm start` 启动开发服务器

## 📚 文档

- [后端 API 文档](src/)
- [前端组件文档](frontend/src/)
- [部署指南](README_TERMINAL.md)
- [开发指南](frontend/README.md)

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 Apache 2.0 许可证。

## 🎉 开始使用

1. **克隆项目**：`git clone <repository-url>`
2. **运行后端测试**：`cargo test`
3. **启动前端**：`cd frontend && npm start`
4. **体验功能**：在浏览器中打开 http://localhost:3000

## 💡 提示

- 这是一个演示项目，展示了完整的区块链投票系统
- 前端使用模拟后端，数据不会持久化
- 实际部署需要 Linera 区块链环境
- 所有功能都经过测试验证

---

**QuickPoll** - 让投票更简单、更透明、更可信！ 🗳️✨
