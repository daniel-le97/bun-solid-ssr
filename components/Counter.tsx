import { Component } from "solid-js";

export const Counter: Component<{start?: number}> = (props) =>{
    const [count, setCount] = createSignal(props.start ?? 0)
    return (
      <div>
        <h1>this is the counter component itself</h1>
        <Show when={count() > 20} fallback={
          <>
            <p>Count: {count()}</p>
            <button onClick={() => setCount(count() + 1)}>Increment</button>
          </>
        }>
          <div>Count limit reached</div>
        </Show>
      </div>
    )
};