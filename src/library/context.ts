const CONTEXT_STORE = new WeakMap<TContext<any>, any[]>();

export type TContext<T> = {
  defaultValue: T;
};

export const getStackContext = <T>(ctx: TContext<T>): T[] => (
  CONTEXT_STORE.get(ctx) ?? (
    CONTEXT_STORE.set(ctx, []),
    CONTEXT_STORE.get(ctx)!
  )
);

export const getContext = <T>(ctx: TContext<T>): T => (
  getStackContext(ctx).at(-1) ?? ctx.defaultValue
);

export const createContext = <T>(
  defaultValue: T
): TContext<T> => ({
  defaultValue
});

export const withContext = <T, R>(
  ctx: TContext<T>,
  value: T,
  runner: () => R
): R => {
  const stack = getStackContext(ctx);

  try {
    stack.push(value);
    return runner();
  } finally {
    stack.pop();
  }
};