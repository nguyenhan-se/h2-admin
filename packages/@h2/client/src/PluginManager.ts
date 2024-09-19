/* eslint-disable perfectionist/sort-classes */
import type { Application } from './Application';
import type { Plugin } from './Plugin';

export type PluginOptions<T = any> = {
  config?: T;
  name?: string;
  packageName?: string;
};
export type PluginType<Opts = any> =
  | [typeof Plugin<Opts>, PluginOptions<Opts>]
  | typeof Plugin;
export type PluginData = {
  name: string;
  packageName: string;
  type: 'local';
  url: string;
  version: string;
};

export class PluginManager {
  protected pluginInstances: Map<typeof Plugin, Plugin> = new Map();
  protected pluginsAliases: Record<string, Plugin> = {};
  private initPlugins: Promise<void>;

  constructor(
    protected _plugins: PluginType[],
    protected app: Application,
  ) {
    this.app = app;
    this.initPlugins = this.init(_plugins);
  }

  /**
   * @internal
   */
  async init(_plugins: PluginType[]) {
    await this.initStaticPlugins(_plugins);
  }

  private async initStaticPlugins(_plugins: PluginType[] = []) {
    for await (const plugin of _plugins) {
      const pluginClass = Array.isArray(plugin) ? plugin[0] : plugin;
      const opts = Array.isArray(plugin) ? plugin[1] : undefined;
      await this.add(pluginClass, opts);
    }
  }

  async add<T = any>(plugin: typeof Plugin, opts: PluginOptions<T> = {}) {
    const instance = this.getInstance(plugin, opts);

    this.pluginInstances.set(plugin, instance);

    if (opts.name) {
      this.pluginsAliases[opts.name] = instance;
    }

    if (opts.packageName) {
      this.pluginsAliases[opts.packageName] = instance;
    }

    await instance.afterAdd();
  }

  get<T extends typeof Plugin>(PluginClass: T): InstanceType<T>;
  get<T extends object>(name: string): T;

  get(nameOrPluginClass: any) {
    if (typeof nameOrPluginClass === 'string') {
      return this.pluginsAliases[nameOrPluginClass];
    }
    return this.pluginInstances.get(
      nameOrPluginClass.default || nameOrPluginClass,
    );
  }

  private getInstance<T>(NPlugin: typeof Plugin, opts?: T) {
    return new NPlugin(opts, this.app);
  }

  /**
   * @internal
   */
  async load() {
    await this.initPlugins;

    for (const plugin of this.pluginInstances.values()) {
      await plugin.beforeLoad();
    }

    for (const plugin of this.pluginInstances.values()) {
      await plugin.load();
    }
  }
}
