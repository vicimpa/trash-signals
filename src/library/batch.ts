const BATCH_KEYS = new Map<string | symbol, number>();

export const batch = (key: string | symbol, func: Function) => {
  const timeout = BATCH_KEYS.get(key);

  if (typeof timeout === 'number')
    clearTimeout(timeout);

  BATCH_KEYS.set(key, setTimeout(func));
};

export const makeBatch = () => (
  batch.bind(null, Symbol('batch'))
);