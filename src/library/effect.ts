import { makeBatch } from "./";
import { createContext, getContext, withContext } from "./context";
import { TSignal } from "./signal";

export type TEffect = () => Function | void;

const SignalSetCTX = createContext<Set<TSignal<any>> | null>(null);

export const effectSub = (v: TSignal<any>): void => {
  getContext(SignalSetCTX)?.add(v);
};

export const effect = (func: TEffect, initialEmit = true) => {
  var subs = new Set<Function>();
  var signals = new Set<TSignal<any>>();
  var batch = makeBatch();

  var effect = () => (
    withContext(SignalSetCTX, signals, () => {
      subs.forEach(sub => sub());
      subs.clear();
      signals.clear();

      func();

      signals.forEach(sig => (
        subs.add(
          sig.subscribe(() => (
            batch(effect)
          ), false)
        )
      ));
    })
  );

  return (
    initialEmit && effect(),
    () => subs.forEach(sub => sub())
  );
};