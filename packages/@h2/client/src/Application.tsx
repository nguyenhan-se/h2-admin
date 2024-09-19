/* eslint-disable perfectionist/sort-classes */
import { type Component, type FunctionalComponent, h } from 'vue';

import { AppComponent } from './components';
import { PluginManager, type PluginType } from './PluginManager';

export type ComponentAndProps<T = any> = [Component, T];
export interface ApplicationOptions {
  components?: Record<string, Component>;
  plugins?: PluginType[];
  providers?: (Component | ComponentAndProps)[];
}

export class Application {
  public providers: ComponentAndProps[] = [];
  public components: Record<string, Component> = {};

  public pluginManager: PluginManager;

  loading = true;
  error = null;
  get pm() {
    return this.pluginManager;
  }

  constructor(protected options: ApplicationOptions = {}) {
    this.pluginManager = new PluginManager(options.plugins || [], this);
  }

  getRootComponent(WrapperComponent: Component) {
    const Root: FunctionalComponent = (_) => {
      return <AppComponent app={this}>{h(WrapperComponent)}</AppComponent>;
    };
    return Root;
  }

  use<T = any>(component: Component, props?: T) {
    return this.addProvider(component, props);
  }

  addProvider<T = any>(component: Component, props?: T) {
    return this.providers.push([component, props]);
  }

  addProviders(providers: ([Component, any] | Component)[]) {
    providers.forEach((provider) => {
      if (Array.isArray(provider)) {
        this.addProvider(provider[0], provider[1]);
      } else {
        this.addProvider(provider);
      }
    });
  }

  async load() {
    try {
      this.loading = true;
      await this.pm.load();
    } catch (error) {
      const toError = (error: any) => {
        if (typeof error?.response?.data === 'string') {
          return { message: error?.response?.data };
        }
        if (error?.response?.data?.error) {
          return error?.response?.data?.error;
        }
        if (error?.response?.data?.errors?.[0]) {
          return error?.response?.data?.errors?.[0];
        }
        return { message: error?.message };
      };
      this.error = {
        code: 'LOAD_ERROR',
        ...toError(error),
      };
      console.error(error, this.error);
    }
    this.loading = false;
  }

  /**
   * @internal
   */
  protected addComponent(component: Component, name: string) {
    const componentName = name;
    if (!componentName) {
      console.error(
        'Component must have a displayName or pass name as second argument',
      );
      return;
    }
    // set(this.components, componentName, component);
    this.components[componentName] = component;
  }

  addComponents(components: Record<string, Component>) {
    Object.keys(components).forEach((name) => {
      this.addComponent(components[name] as never, name);
    });
  }
}
