import * as migration_20260725_201305_initial from './20260725_201305_initial';

export const migrations = [
  {
    up: migration_20260725_201305_initial.up,
    down: migration_20260725_201305_initial.down,
    name: '20260725_201305_initial'
  },
];
