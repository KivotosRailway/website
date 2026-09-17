<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# KivotosRailway 开发指南

## 运行环境与验证

- 使用 Node.js 22.11.0 和 pnpm 10.24.0。版本分别由 `.nvmrc`、`edgeone.json` 和 `package.json` 固定；不要升级到 pnpm 11，EdgeOne 当前没有 Node.js 22.13.0。
- 依赖必须使用 `corepack pnpm install --frozen-lockfile` 安装。修改直接依赖后同步更新 `pnpm-lock.yaml`。
- 修改 TypeScript、样式、路由、数据读取或构建配置后，运行 `corepack pnpm lint` 和 `corepack pnpm build`。构建必须生成 `out/`，并检查 `git diff --check`。
- 本项目使用 `output: "export"`。不要引入依赖服务器运行时、请求时 API、Next Image 默认优化器或无法在静态导出中生成的动态路由实现。

## 路由与语言

- 唯一允许的公开语言前缀是精确大小写的 `zh-Hans`、`zh-Hant`、`en`、`jp`。生成链接时始终使用 `withLocale()`，不要手写语言路径或使用 `zh-CN`、`zh-TW`、`ja` 作为公开 URL。
- `zh-CN`、`zh-TW` 与 `ja` 仅是内容目录和翻译文件名。映射集中在 `src/lib/i18n.ts` 的 `localeContentDirectory`。
- 修改历史 URL 或地区语言重定向时，同时覆盖根路径和子路径，并保留大小写变体。EdgeOne 规则在 `edgeone.json`；不要让 Next.js 的客户端重定向替代可由边缘层完成的永久重定向。
- 每个 `[locale]` 页面在读取内容前必须使用 `isLocale()` 检查参数，并对无效语言调用 `notFound()`。静态参数只能列出 `locales` 中的四种语言。
- 客户端语言状态以 URL 为主。`LocaleUrlSync` 处理无前缀入口；组件需要响应语言变化时订阅 `kr-locale-change`，并在卸载时移除监听器。

## 内容与组件

- 新闻 Markdown：`src/data/news/posts/<zh-CN|zh-TW|en|ja>/`；政策 Markdown：`src/data/policy/<目录>/`。编辑文章时保持 YAML frontmatter 格式。
- 新闻、政策的读取函数负责语言回退。不要为了单页把四种语言的全部文章内容传给客户端。
- 友情链接只维护 `src/data/links.json`。`i18n` 是可选对象；只为确有译文的字段添加翻译，其他语言回退默认文案。
- 共享页面框架使用 `SiteShell`。政策、免责声明和友情链接的顶部横幅分别复用已有图和 CSS 规则，改动前核对相同页面的结构与样式。
- `public/media/news/` 和 `src/lib/image-map.generated.ts` 由 `pnpm cache-images` 生成；不要手动编辑映射文件。

## 主题、HTML 与错误页

- 暗色首屏依赖 `globals.css` 中的 `prefers-color-scheme` 初始变量和 `site-document.tsx` 的 viewport 颜色。修改主题时保持这两处同步，避免在暗色设备出现白色闪屏。
- 不要在 React 组件、布局或 `not-found` 页面中渲染 `<script>`、`next/script` 或通过 `typeof window` 改变首个服务端/客户端渲染树。Next.js 16 会报告脚本无法执行或水合不一致。
- 页脚 ICP 链接必须在服务端与客户端使用相同初始快照。涉及浏览器 host 的显示逻辑使用 `useSyncExternalStore` 或在水合后更新。
- 根与语言目录的 `not-found.tsx` 都必须保留，且 `wrangler.jsonc` 必须保持 `not_found_handling: "404-page"`，使未知静态 URL 返回站点 404。

## EdgeOne 与 Cloudflare

- EdgeOne 静态构建命令：`pnpm run build`；发布由平台执行。其配置在 `edgeone.json`，其中 Node.js 版本必须为 `22.11.0`。
- Cloudflare 静态资源配置位于 `wrangler.jsonc`，目标目录是 `./out`。部署使用 `pnpm run deploy`，本地 Worker 预览使用 `pnpm run preview`。
- 不要提交 `.next/`、`out/` 或 `node_modules/`。若静态导出页面数量或产物显著增大，先检查重复的 legacy 路由和传到客户端的数据量，以免耗尽 EdgeOne 构建内存盘。
