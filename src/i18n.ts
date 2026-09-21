export type Locale = "en" | "zh";

interface Messages {
  metaTitle: string;
  metaDescription: string;
  brand: string;
  docs: string;
  submit: string;
  language: string;
  eyebrow: string;
  title: string;
  registry: string;
  searchLabel: string;
  searchPlaceholder: string;
  pluginCount: (count: number) => string;
  browse: string;
  all: string;
  preview: string;
  stable: string;
  catalog: string;
  cacheNote: string;
  source: string;
  release: string;
  noResultsTitle: string;
  noResultsBody: string;
  unavailableTitle: string;
  unavailableBody: string;
  openRegistry: string;
  footer: string;
}

export const messages: Record<Locale, Messages> = {
  en: {
    metaTitle: "Eidos Plugin Marketplace",
    metaDescription: "Discover community plugins for Eidos Lite and eidos serve.",
    brand: "Eidos Plugins",
    docs: "Developer docs",
    submit: "Submit a plugin",
    language: "中文",
    eyebrow: "Community marketplace",
    title: "Apps for files you own.",
    registry: "Open GitHub registry",
    searchLabel: "Search plugins",
    searchPlaceholder: "Search plugins",
    pluginCount: (count) => `${count} ${count === 1 ? "plugin" : "plugins"}`,
    browse: "Browse",
    all: "All plugins",
    preview: "Preview",
    stable: "Stable",
    catalog: "Plugins",
    cacheNote: "Synced from GitHub · cached for 10 minutes",
    source: "Source",
    release: "Release",
    noResultsTitle: "No plugins found",
    noResultsBody: "Try another name, capability, or plugin ID.",
    unavailableTitle: "The plugin catalog is temporarily unavailable.",
    unavailableBody: "You can inspect the registry directly on GitHub.",
    openRegistry: "Open registry",
    footer: "Community plugins for user-owned files.",
  },
  zh: {
    metaTitle: "Eidos 插件市场",
    metaDescription: "发现适用于 Eidos Lite 与 eidos serve 的社区插件。",
    brand: "Eidos 插件",
    docs: "开发文档",
    submit: "提交插件",
    language: "English",
    eyebrow: "社区插件市场",
    title: "为自己的文件，\n选择本地应用。",
    registry: "开放的 GitHub 注册表",
    searchLabel: "搜索插件",
    searchPlaceholder: "搜索插件",
    pluginCount: (count) => `${count} 个插件`,
    browse: "浏览",
    all: "全部插件",
    preview: "预览版",
    stable: "稳定版",
    catalog: "插件",
    cacheNote: "同步自 GitHub · 缓存 10 分钟",
    source: "源码",
    release: "发布版本",
    noResultsTitle: "没有找到插件",
    noResultsBody: "试试其他名称、能力或插件 ID。",
    unavailableTitle: "暂时无法读取插件目录。",
    unavailableBody: "你仍然可以前往 GitHub 查看注册表。",
    openRegistry: "打开注册表",
    footer: "面向用户自有文件的社区插件。",
  },
};
