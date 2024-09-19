<script lang="ts" setup>
import { watch } from 'vue';

import { Application } from '../Application';
import { provideApplicationContext } from '../context';

defineOptions({ name: 'App' });
const { app } = defineProps<{
  app: Application;
}>();

provideApplicationContext({ app });

watch(
  () => app,
  async () => {
    await app.load();
  },
  { immediate: true },
);
</script>

<template>
  <slot></slot>
</template>
