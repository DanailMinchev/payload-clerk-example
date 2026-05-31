import * as migration_20260531_123450_initial from './20260531_123450_initial';

export const migrations = [
  {
    up: migration_20260531_123450_initial.up,
    down: migration_20260531_123450_initial.down,
    name: '20260531_123450_initial'
  },
];
