# KivotosRailway Website

KivotosRailway 的官方网站。本站提供新闻、政策与免责声明、友情链接和错误页面，并支持简体中文、繁體中文、English、日本語。

## 技术栈

- Next.js 16
- React 19 与 TypeScript
- pnpm
- EdgeOne 静态部署

## 本地运行

建议使用 Node.js 22.11.0 与 pnpm 10.24.0。

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

## 常用命令

```bash
corepack pnpm lint          # 检查代码
corepack pnpm build         # 构建静态站点到 out/
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
