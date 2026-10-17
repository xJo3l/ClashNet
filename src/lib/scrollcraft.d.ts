export interface ScrollCraftInstance {
  destroy: () => void;
  layout: () => void;
  read: () => void;
}

export interface ScrollCraftAPI {
  mount: (root?: Element | Document | string, opts?: { lerp?: number }) => ScrollCraftInstance;
  reduce: boolean;
  instances: ScrollCraftInstance[];
}

export declare const ScrollCraft: ScrollCraftAPI | null;
export default ScrollCraft;
