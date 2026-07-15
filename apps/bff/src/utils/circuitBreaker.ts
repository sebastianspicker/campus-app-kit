type CircuitState = "closed" | "open" | "half_open";

interface CircuitBreakerState {
  currentState: CircuitState;
  consecutiveFailures: number;
  openedAt: number;
  stateVersion: number;
}

export interface CircuitBreakerConfig {
  readonly name: string;
  readonly failureThreshold: number;
  readonly cooldownMs: number;
}

export class CircuitOpenError extends Error {
  constructor(circuitName: string) {
    super(`Circuit breaker "${circuitName}" is open — request rejected`);
    this.name = "CircuitOpenError";
  }
}

export interface CircuitBreaker {
  call<T>(fn: () => Promise<T>): Promise<T>;
  state(): CircuitState;
}

function transitionToOpen(state: CircuitBreakerState): void {
  state.currentState = "open";
  state.openedAt = Date.now();
  state.stateVersion += 1;
}

function transitionToClosed(state: CircuitBreakerState): void {
  state.currentState = "closed";
  state.consecutiveFailures = 0;
  state.stateVersion += 1;
}

function shouldAttemptProbe(state: CircuitBreakerState, config: CircuitBreakerConfig): boolean {
  return state.currentState === "open" && Date.now() - state.openedAt >= config.cooldownMs;
}

function beginCall(state: CircuitBreakerState, config: CircuitBreakerConfig): { isProbe: boolean; callVersion: number } {
  let isProbe = false;
  if (state.currentState === "open") {
    if (shouldAttemptProbe(state, config)) {
      state.currentState = "half_open";
      state.stateVersion += 1;
      isProbe = true;
    } else {
      throw new CircuitOpenError(config.name);
    }
  }
  if (!isProbe && state.currentState === "half_open") throw new CircuitOpenError(config.name);
  return { isProbe, callVersion: state.stateVersion };
}

function handleSuccess(state: CircuitBreakerState, isProbe: boolean, callVersion: number): void {
  if (state.stateVersion !== callVersion) return;
  if (isProbe) {
    transitionToClosed(state);
  } else {
    state.consecutiveFailures = 0;
  }
}

function handleFailure(
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
  isProbe: boolean,
  callVersion: number
): void {
  if (state.stateVersion !== callVersion) return;
  state.consecutiveFailures += 1;
  if (isProbe || state.consecutiveFailures >= config.failureThreshold) transitionToOpen(state);
}

async function executeCircuitCall<T>(
  state: CircuitBreakerState,
  config: CircuitBreakerConfig,
  fn: () => Promise<T>
): Promise<T> {
  const { isProbe, callVersion } = beginCall(state, config);
  try {
    const result = await fn();
    handleSuccess(state, isProbe, callVersion);
    return result;
  } catch (err: unknown) {
    handleFailure(state, config, isProbe, callVersion);
    throw err;
  }
}

export function createCircuitBreaker(config: CircuitBreakerConfig): CircuitBreaker {
  const circuitState: CircuitBreakerState = {
    currentState: "closed",
    consecutiveFailures: 0,
    openedAt: 0,
    stateVersion: 0
  };

  return {
    call: (fn) => executeCircuitCall(circuitState, config, fn),
    state: () => circuitState.currentState
  };
}
