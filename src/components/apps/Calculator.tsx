import { useState, useCallback } from "react";

const buttons = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
] as const;

type Op = "+" | "−" | "×" | "÷";

export default function Calculator({ windowId: _windowId }: { windowId: string }) {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Op | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const calculate = useCallback(
    (a: number, op: Op, b: number): number => {
      switch (op) {
        case "+":
          return a + b;
        case "−":
          return a - b;
        case "×":
          return a * b;
        case "÷":
          return b !== 0 ? a / b : NaN;
      }
    },
    []
  );

  const handleButton = useCallback(
    (val: string) => {
      const num = parseFloat(display);

      if (val === "C") {
        setDisplay("0");
        setPrevValue(null);
        setOperator(null);
        setWaitingForOperand(false);
        return;
      }

      if (val === "±") {
        setDisplay(String(-num));
        return;
      }

      if (val === "%") {
        setDisplay(String(num / 100));
        return;
      }

      if (["+", "−", "×", "÷"].includes(val)) {
        const op = val as Op;
        if (operator && !waitingForOperand) {
          const result = prevValue !== null ? calculate(prevValue, operator, num) : num;
          setDisplay(String(result));
          setPrevValue(result);
        } else {
          setPrevValue(num);
        }
        setOperator(op);
        setWaitingForOperand(true);
        return;
      }

      if (val === "=") {
        if (operator && prevValue !== null) {
          const result = calculate(prevValue, operator, num);
          setDisplay(Number.isNaN(result) ? "Error" : String(result));
          setPrevValue(null);
          setOperator(null);
        }
        setWaitingForOperand(false);
        return;
      }

      if (val === ".") {
        if (waitingForOperand) {
          setDisplay("0.");
          setWaitingForOperand(false);
        } else if (!display.includes(".")) {
          setDisplay(display + ".");
        }
        return;
      }

      // Number
      if (waitingForOperand) {
        setDisplay(val);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === "0" ? val : display + val);
      }
    },
    [display, prevValue, operator, waitingForOperand, calculate]
  );

  const isOperator = (v: string) => ["+", "−", "×", "÷"].includes(v);
  const isAction = (v: string) => ["C", "±", "%", "="].includes(v);

  return (
    <div className="h-full bg-black/30 flex flex-col">
      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-5 pb-3">
        <span className="text-4xl font-light text-white/90 tracking-tight">
          {display}
        </span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-1.5 px-2 pb-3">
        {buttons.flat().map((val) => (
          <button
            key={val}
            onClick={() => handleButton(val)}
            className={`h-14 rounded-xl text-lg font-medium transition-all active:scale-95 ${
              val === "0"
                ? "col-span-2"
                : ""
            } ${
              isOperator(val)
                ? "bg-indigo-500/30 text-indigo-300 hover:bg-indigo-500/40"
                : isAction(val)
                ? "bg-white/[0.08] text-white/70 hover:bg-white/[0.12]"
                : "bg-white/[0.04] text-white/80 hover:bg-white/[0.08]"
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}
