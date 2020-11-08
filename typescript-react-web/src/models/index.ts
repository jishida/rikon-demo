import { createContext } from 'react';

import Model from './model';

export { default as Child } from './child';
export { default as Model } from './model';

export const Context = createContext(new Model());
