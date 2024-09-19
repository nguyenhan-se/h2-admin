import type { Application } from './Application';

import { createContext } from './shared';

export const [injectApplicationContext, provideApplicationContext] =
  createContext<{ app: Application }>('ApplicationContext');
