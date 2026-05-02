#!/usr/bin/env node

/**
 * Supported operations:
 * - addition (+, add)
 * - subtraction (-, −, subtract)
 * - multiplication (*, x, X, ×, multiply)
 * - division (/, ÷, divide)
 */

function printUsage() {
  console.log("Usage: node src/calculator.js <number> <operator> <number>");
  console.log("Example: node src/calculator.js 8 + 2");
}

function normalizeOperator(operator) {
  const operators = {
    "+": "addition",
    add: "addition",
    "-": "subtraction",
    "−": "subtraction",
    subtract: "subtraction",
    "*": "multiplication",
    x: "multiplication",
    X: "multiplication",
    "×": "multiplication",
    multiply: "multiplication",
    "/": "division",
    "÷": "division",
    divide: "division"
  };

  return operators[operator];
}

function calculate(left, operator, right) {
  switch (operator) {
    case "addition":
      return left + right;
    case "subtraction":
      return left - right;
    case "multiplication":
      return left * right;
    case "division":
      if (right === 0) {
        throw new Error("Division by zero is not allowed.");
      }

      return left / right;
    default:
      throw new Error("Unsupported operation.");
  }
}

function run(args = process.argv.slice(2), io = console) {
  const previousExitCode = process.exitCode;

  if (args.length !== 3) {
    io.log("Usage: node src/calculator.js <number> <operator> <number>");
    io.log("Example: node src/calculator.js 8 + 2");
    process.exitCode = 1;
    return;
  }

  const [leftArg, operatorArg, rightArg] = args;
  const left = Number(leftArg);
  const right = Number(rightArg);
  const operator = normalizeOperator(operatorArg);

  if (Number.isNaN(left) || Number.isNaN(right)) {
    io.error("Both operands must be valid numbers.");
    process.exitCode = 1;
    return;
  }

  if (!operator) {
    io.error("Operator must be one of +, -, *, /, add, subtract, multiply, or divide.");
    process.exitCode = 1;
    return;
  }

  if (operator === "division" && right === 0) {
    io.error("Division by zero is not allowed.");
    process.exitCode = 1;
    return;
  }

  const result = calculate(left, operator, right);
  io.log(result);
  process.exitCode = previousExitCode;
}

if (require.main === module) {
  run();
}

module.exports = {
  calculate,
  normalizeOperator,
  printUsage,
  run
};
