export const PLUGIN_REGISTRY_URL =
  "https://raw.githubusercontent.com/eidos-space/registry/main/plugins.registry.json";
export const PLUGIN_REGISTRY_REPO = "https://github.com/eidos-space/registry";
export const PLUGIN_REGISTRY_CACHE_SECONDS = 10 * 60;

export const PLUGIN_CATEGORIES = [
  "data-visualization",
  "knowledge-and-writing",
  "productivity",
  "automation",
  "integrations",
  "developer-tools",
  "other",
] as const;
export type PluginCategory = (typeof PLUGIN_CATEGORIES)[number];

const PLUGIN_REGISTRY_CACHE_KEY =
  "https://plugins.eidos.space/.well-known/plugins-registry-v1.json";

export interface MarketplacePlugin {
  id: string;
  name: string;
  description: string;
  category: PluginCategory;
  repo: string;
  version: string;
  tag: string;
  asset: string;
  sha256: string;
  compatibility: string;
  icon?: { paths: string[] };
  screenshots?: { path: string; alt: string }[];
}

export interface PluginRegistry {
  schemaVersion: 1;
  plugins: MarketplacePlugin[];
}

export function pluginVisualVariant(id: string): 1 | 2 | 3 {
  const total = Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return ((total % 3) + 1) as 1 | 2 | 3;
}

const GITHUB_REPO = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const PLUGIN_CATEGORY_SET = new Set<string>(PLUGIN_CATEGORIES);
const SCREENSHOT_PATH = /^(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9][A-Za-z0-9._/-]*\.(?:png|jpe?g|webp)$/u;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function parsePlugin(value: unknown): MarketplacePlugin | null {
  if (!isRecord(value)) return null;

  if (
    !isNonEmptyString(value.id) ||
    !isNonEmptyString(value.name) ||
    !isNonEmptyString(value.description) ||
    !isNonEmptyString(value.category) ||
    !PLUGIN_CATEGORY_SET.has(value.category) ||
    !isNonEmptyString(value.repo) ||
    !GITHUB_REPO.test(value.repo) ||
    !isNonEmptyString(value.version) ||
    !isNonEmptyString(value.tag) ||
    !isNonEmptyString(value.asset) ||
    !isNonEmptyString(value.sha256) ||
    !SHA256.test(value.sha256) ||
    value.preview !== false ||
    !isNonEmptyString(value.compatibility)
  ) {
    return null;
  }

  let icon: MarketplacePlugin["icon"];
  if (isRecord(value.icon) && Array.isArray(value.icon.paths)) {
    const paths = value.icon.paths.filter(isNonEmptyString).slice(0, 8);
    if (paths.length > 0) icon = { paths };
  }

  const screenshots = Array.isArray(value.screenshots)
    ? value.screenshots.flatMap((item) => {
        if (
          !isRecord(item) ||
          !isNonEmptyString(item.path) ||
          !SCREENSHOT_PATH.test(item.path) ||
          !isNonEmptyString(item.alt)
        ) return [];
        return [{ path: item.path, alt: item.alt }];
      }).slice(0, 8)
    : [];

  return {
    id: value.id,
    name: value.name,
    description: value.description,
    category: value.category as PluginCategory,
    repo: value.repo,
    version: value.version,
    tag: value.tag,
    asset: value.asset,
    sha256: value.sha256,
    compatibility: value.compatibility,
    ...(icon ? { icon } : {}),
    ...(screenshots.length ? { screenshots } : {}),
  };
}

export function parsePluginRegistry(value: unknown): PluginRegistry {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.plugins)) {
    throw new Error("Unsupported plugin registry response");
  }

  const plugins = value.plugins.flatMap((plugin) => {
    const parsed = parsePlugin(plugin);
    return parsed ? [parsed] : [];
  });

  if (value.plugins.length > 0 && plugins.length === 0) {
    throw new Error("Plugin registry contains no valid entries");
  }

  return { schemaVersion: 1, plugins };
}

interface RegistryCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}

interface PluginRegistryLoaderOptions {
  cacheSeconds?: number;
  fetchImpl?: typeof fetch;
  getCache?: () => RegistryCache | undefined;
  now?: () => number;
}

function defaultCache(): RegistryCache | undefined {
  if (typeof caches === "undefined") return undefined;
  return (caches as unknown as { default?: RegistryCache }).default;
}

export function createPluginRegistryLoader({
  cacheSeconds = PLUGIN_REGISTRY_CACHE_SECONDS,
  fetchImpl = fetch,
  getCache = defaultCache,
  now = Date.now,
}: PluginRegistryLoaderOptions = {}): () => Promise<PluginRegistry> {
  let memoryCache: { value: PluginRegistry; expiresAt: number } | undefined;
  let lastSuccessfulRegistry: PluginRegistry | undefined;
  let pendingLoad: Promise<PluginRegistry> | undefined;

  const load = async (): Promise<PluginRegistry> => {
    const currentTime = now();
    if (memoryCache && memoryCache.expiresAt > currentTime) return memoryCache.value;

    const cache = getCache();
    const cacheKey = new Request(PLUGIN_REGISTRY_CACHE_KEY);
    if (cache) {
      try {
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          const registry = parsePluginRegistry(await cachedResponse.json());
          memoryCache = { value: registry, expiresAt: currentTime + cacheSeconds * 1_000 };
          lastSuccessfulRegistry = registry;
          return registry;
        }
      } catch {
        // A corrupt or unavailable edge cache must not block a GitHub refresh.
      }
    }

    try {
      const response = await fetchImpl(PLUGIN_REGISTRY_URL, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(4_000),
      });
      if (!response.ok) throw new Error(`Plugin registry returned ${response.status}`);

      const registry = parsePluginRegistry(await response.json());
      memoryCache = { value: registry, expiresAt: currentTime + cacheSeconds * 1_000 };
      lastSuccessfulRegistry = registry;

      if (cache) {
        const cachedResponse = Response.json(registry, {
          headers: { "Cache-Control": `public, max-age=${cacheSeconds}` },
        });
        await cache.put(cacheKey, cachedResponse).catch(() => undefined);
      }

      return registry;
    } catch (error) {
      if (lastSuccessfulRegistry) return lastSuccessfulRegistry;
      throw error;
    }
  };

  return () => {
    pendingLoad ??= load().finally(() => {
      pendingLoad = undefined;
    });
    return pendingLoad;
  };
}

const defaultLoader = createPluginRegistryLoader();

export const loadPluginRegistry = (): Promise<PluginRegistry> => defaultLoader();
