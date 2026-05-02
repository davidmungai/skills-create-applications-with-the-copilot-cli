#!/usr/bin/env node

/**
 * Supported operations:
 * - addition (+, add)
 * - subtraction (-, −, subtract)
 * - multiplication (*, x, X, ×, multiply)
 * - division (/, ÷, divide)
 * - modulo (%, mod, modulo)
 * - exponentiation (**, ^, pow, power)
 * - square root (sqrt, squareRoot)
 */

function printUsage() {
  console.log("Usage: node src/calculator.js <number> <operator> [<number>]");
  console.log("Example: node src/calculator.js 8 + 2");
  console.log("Example: node src/calculator.js 9 sqrt");
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
    divide: "division",
    "%": "modulo",
    mod: "modulo",
    modulo: "modulo",
    "**": "power",
    "^": "power",
    pow: "power",
    power: "power",
    sqrt: "squareRoot",
    squareRoot: "squareRoot"
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
    case "modulo":
      if (right === 0) {
        throw new Error("Modulo by zero is not allowed.");
      }

      return left % right;
    case "power":
      return Math.pow(left, right);
    case "squareRoot":
      if (left < 0) {
        throw new Error("Square root of a negative number is not allowed.");
      }

      return Math.sqrt(left);
    default:
      throw new Error("Unsupported operation.");
  }
}

function run(args = process.argv.slice(2), io = console) {
  const previousExitCode = process.exitCode;

  // squareRoot is a unary operation: <number> <operator>
  const isUnary = args.length === 2 && normalizeOperator(args[1]) === "squareRoot";

  if (!isUnary && args.length !== 3) {
    io.log("Usage: node src/calculator.js <number> <operator> [<number>]");
    io.log("Example: node src/calculator.js 8 + 2");
    io.log("Example: node src/calculator.js 9 sqrt");
    process.exitCode = 1;
    return;
  }

  const [leftArg, operatorArg, rightArg] = args;
  const left = Number(leftArg);
  const right = isUnary ? undefined : Number(rightArg);
  const operator = normalizeOperator(operatorArg);

  if (Number.isNaN(left) || (!isUnary && Number.isNaN(right))) {
    io.error("Both operands must be valid numbers.");
    process.exitCode = 1;
    return;
  }

  if (!operator) {
    io.error("Operator must be one of +, -, *, /, %, **, add, subtract, multiply, divide, mod, pow, sqrt.");
    process.exitCode = 1;
    return;
  }

  if (operator === "division" && right === 0) {
    io.error("Division by zero is not allowed.");
    process.exitCode = 1;
    return;
  }

  if (operator === "modulo" && right === 0) {
    io.error("Modulo by zero is not allowed.");
    process.exitCode = 1;
    return;
  }

  if (operator === "squareRoot" && left < 0) {
    io.error("Square root of a negative number is not allowed.");
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
