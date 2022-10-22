import React, { useState } from "react";

/**
 * A function to force state to update.  Use in the component and it will render it and all it's child branches.
 * @returns () => void
 */
export default function useForceUpdate() {
  const [v, setState] = useState(0);
  return () => setState((v) => v + 1);
}
