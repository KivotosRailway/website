# KivotosRailway Website

KivotosRailway 的官方网站。本站提供新闻、政策与免责声明、友情链接和错误页面，并支持简体中文、繁體中文、English、日本語。

## 技术栈

- Next.js 16
- React 19 与 TypeScript
- pnpm
- EdgeOne 静态部署

## 本地运行

使用 Node.js 24.22.1 与 pnpm 11.25.0（与 `.nvmrc` 和 `package.json` 一致）。

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

## 常用命令

```bash
corepack pnpm lint          # 检查代码
corepack pnpm build         # 构建静态站点到 out/
corepack pnpm test          # 内容回退和 URL/SEO 单元测试
corepack pnpm test:export   # 检查 out/ 的静态资源引用
corepack pnpm test:e2e      # 在 out/ 上运行浏览器回归测试
corepack pnpm check         # lint、单元测试、构建、产物与浏览器检查
corepack pnpm cache-images  # 缓存新闻中的远程图片
corepack pnpm deploy        # 使用 Wrangler 部署
```

## 目录概览

```text
src/app/           页面和路由
src/components/    页面组件与站点布局
src/data/news/     新闻 Markdown 内容
src/data/policy/   政策与声明内容
src/data/links.json 友情链接数据
src/locales/       UI 文案翻译
public/            图片、图标与其他静态资源
```

公开语言路径为 `/zh-Hans/`、`/zh-Hant/`、`/en/` 和 `/jp/`。例如：`/zh-Hans/news/`、`/en/links/`。

## 静态导出与回归测试

首次运行浏览器测试前执行 `corepack pnpm exec playwright install chromium`。测试使用本机 `127.0.0.1:4173` 服务已构建的 `out/`，覆盖 SPA 导航、语言切换、主题持久化、移动菜单、SEO 与 404。CI 使用 `.nvmrc` 固定的 Node.js 版本执行 `corepack pnpm check`。

新闻列表仅传递摘要，详情按 slug 回退到中文；首页只读取当前语言的三条新闻。政策正文在构建时渲染，不向客户端传递四种语言的全文。

SEO 默认主域名为 `https://www.kivotos.cc`，可在构建时通过 `NEXT_PUBLIC_SITE_URL` 设置主域名（不带路径）。所有页面的 canonical、hreflang、Open Graph 和 sitemap 共用此配置。`jp` 是公开路由，HTML 的 `lang` 和 hreflang 使用 `ja`。

`pnpm build` 在 Next.js 静态导出后执行 `scripts/finalize-export.mts`，按路径设置 HTML 初始语言，并在 head 尾部加入同步主题初始化脚本，使保存的主题在正文首次绘制前生效。这不在 React 树中插入脚本，也不改变 SPA 路由。请使用完整构建命令；`next dev` 不执行导出后处理，首屏主题验证以构建产物为准。

资源检查明确记录现有 8 张缺失新闻缓存图，以及 20240917 新闻的相对封面路径（四种语言均存在），输出诊断信息；这些图片修复不在本轮范围内，任何新增缺失资源都会使检查失败。修复图片后应移除 `tests/export/assets.test.ts` 中的对应记录。
