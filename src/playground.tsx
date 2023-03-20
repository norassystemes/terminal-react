import * as React from "react";
import { Body, Root, Terminal, useTerminal } from ".";

export const Playground = () => {
  const { line } = useTerminal();

  return (
    <Terminal>
      <div>
        <h1>Playground</h1>
        <p>This is a playground for testing out the terminal.</p>
        <p>
          <button
            onClick={() =>
              line.add({
                id: Math.random().toString(),
                content: "Hello World!",
                timestamp: new Date(),
              })
            }
          >
            Say Hello
          </button>
        </p>
      </div>
    </Terminal>
  );
};

function test() {
  return "";
}
