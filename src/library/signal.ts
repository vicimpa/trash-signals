import { makeBatch } from "./";
import { effectSub } from "./effect";
import { except } from "./except";

export type TListener<T> = (value: T) => any;

export type TSignal<T> = {
  value: T;
  pick(): T;
  subscribe(listener: TListener<T>, initialEmit?: boolean): () => void;
};

export const signal = <T>(value: T): TSignal<T> => {
  var subs = new Set<Function>();
  var lock = false;
  var batch = makeBatch();

  return {
    pick() {
      return value;
    },
    get value() {
      effectSub(this);
      return value;
    },
    set value(v) {
      lock && except('Signal has recursive change');

      if (value === v)
        return;

      value = v;

      batch(() => {
        try {
          lock = true;
          subs.forEach(sub => sub());
        } finally {
          lock = false;
        }
      });
    },
    subscribe(listener: TListener<T>, initialEmit = true) {
      const sub = () => listener(value);

      return (
        initialEmit && sub(),
        subs.add(sub),
        () => { subs.delete(sub); }
      );
    }
  };
};