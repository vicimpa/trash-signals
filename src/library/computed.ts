import { effect } from "./effect";
import { signal } from "./signal";

export const computed = <T>(func: () => T) => {
  const output = signal(func());

  effect(() => {
    output.value = func();
  });

  return output;
};