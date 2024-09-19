import { Plugin } from '@h2/client';

export class PluginSampleClient extends Plugin {
  override async afterAdd() {
    console.log('🚀 come here baby ======> ~ PluginSampleClient ~ afterAdd:');
  }

  override async beforeLoad() {
    console.log('🚀 come here baby ======> ~ PluginSampleClient ~ beforeLoad:');
  }

  override async load() {
    console.log('🚀 come here baby ======> ~ PluginSampleClient ~ load:');
  }
}

export default PluginSampleClient;
