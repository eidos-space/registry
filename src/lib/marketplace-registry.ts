import localRegistryData from "../../plugins.registry.json";
import {
  loadPluginRegistry,
  parsePluginRegistry,
  type PluginRegistry,
} from "./plugin-registry";

const localRegistry = parsePluginRegistry(localRegistryData);

export const loadMarketplaceRegistry = (): Promise<PluginRegistry> =>
  import.meta.env.DEV ? Promise.resolve(localRegistry) : loadPluginRegistry();
