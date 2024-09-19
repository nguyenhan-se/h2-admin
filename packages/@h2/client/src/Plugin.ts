/* eslint-disable @typescript-eslint/no-empty-function */
import type { Application } from './Application';

export class Plugin<T = any> {
  constructor(
    public options: T,
    protected app: Application,
  ) {
    this.options = options;
    this.app = app;
  }

  async afterAdd() {}

  async beforeLoad() {}

  async load() {}

  // get dataSourceManager() {
  //   return this.app.dataSourceManager;
  // }

  get pluginManager() {
    return this.app.pluginManager;
  }

  // get pluginSettingsManager() {
  //   return this.app.pluginSettingsManager;
  // }

  get pm() {
    return this.app.pm;
  }

  // get router() {
  //   return this.app.router;
  // }

  // get schemaInitializerManager() {
  //   return this.app.schemaInitializerManager;
  // }

  // get schemaSettingsManager() {
  //   return this.app.schemaSettingsManager;
  // }
}
