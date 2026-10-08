import { aviationStories } from './aviation';
import { fleetStories } from './fleet';
import { groundStories } from './ground';
import type { Story } from './types';

export type { Story };

export const stories: Record<string, Story> = {
  ...aviationStories,
  ...fleetStories,
  ...groundStories,
};
