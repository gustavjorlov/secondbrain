import { flushSync } from "react-dom";

export const transitionViewIfSupported = (updateCb) => {
  // @ts-ignore
  if (document.startViewTransition) {
    // @ts-ignore
    document.startViewTransition(() => {
      flushSync(updateCb);
    });
  } else {
    updateCb();
  }
};
