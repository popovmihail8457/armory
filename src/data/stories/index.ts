import { aviationStories } from './aviation';
import { fleetStories } from './fleet';
import { groundStories } from './ground';
import { groundArmorStories } from './ground-armor';
import { expansionStories } from './expansion';
import { groundModernStories } from './ground-modern';
import type { Story } from './types';

export type { Story };

export const stories: Record<string, Story> = {
  ...aviationStories,
  ...fleetStories,
  ...groundStories,
  ...groundArmorStories,
  ...expansionStories,
  ...groundModernStories,
};
