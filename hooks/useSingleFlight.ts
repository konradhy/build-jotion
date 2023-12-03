import { useCallback, useRef } from "react";

export default function useSingleFlight<
  F extends (...args: any[]) => Promise<any>,
>(fn: F) {
  const flightStatus = useRef({
    inFlight: false,
    upNext: null as null | {
      fn: F;
      resolve: any;
      reject: any;
      args: Parameters<F>;
    },
  });

  return useCallback(
    (...args: Parameters<F>): ReturnType<F> => {
      if (flightStatus.current.inFlight) {
        return new Promise((resolve, reject) => {
          flightStatus.current.upNext = { fn, resolve, reject, args };
        }) as ReturnType<F>;
      }
      flightStatus.current.inFlight = true;
      const firstReq = fn(...args) as ReturnType<F>;
      void (async () => {
        try {
          await firstReq;
        } finally {
        }
        while (flightStatus.current.upNext) {
          let cur = flightStatus.current.upNext;
          flightStatus.current.upNext = null;
          await cur
            .fn(...cur.args)
            .then(cur.resolve)
            .catch(cur.reject);
        }
        flightStatus.current.inFlight = false;
      })();
      return firstReq;
    },
    [fn],
  );
}
