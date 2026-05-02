#!/usr/bin/env node

/**
 * Supported operations:
 * - addition (+, add)
 * - subtraction (-, −, subtract)
 * - multiplication (*, x, X, ×, multiply)
 * - division (/, ÷, divide)
 * - modulo (%, modulo)
 * - power (^, **, power)
 * - square root (sqrt, squareRoot, √)
 */

function printUsage(io = console) {
  io.log("Usage: node src/calculator.js <number> <operator> <number>");
  io.log("   or: node src/calculator.js <operator> <number>");
  io.log("Example: node src/calculator.js 8 + 2");
  io.log("Example: node src/calculator.js sqrt 9");
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
    modulo: "modulo",
    "^": "power",
    "**": "power",
    power: "power",
    sqrt: "squareRoot",
    squareRoot: "squareRoot",
    "√": "squareRoot"
  };

  return operators[operator];
}

function modulo(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error("Square root is not defined for negative numbers.");
  }

  return Math.sqrt(n);
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
      return modulo(left, right);
    case "power":
      return power(left, right);
    case "squareRoot":
      return squareRoot(left);
    default:
      throw new Error("Unsupported operation.");
  }
}

function run(args = process.argv.slice(2), io = console) {
  const previousExitCode = process.exitCode;

  if (args.length !== 2 && args.length !== 3) {
    printUsage(io);
    process.exitCode = 1;
    return;
  }

  const isUnaryOperation = args.length === 2;
  const [firstArg, secondArg, thirdArg] = args;
  const operatorArg = isUnaryOperation ? firstArg : secondArg;
  const operator = normalizeOperator(operatorArg);

  if (isUnaryOperation && operator !== "squareRoot") {
    printUsage(io);
    process.exitCode = 1;
    return;
  }

  if (!operator) {
    io.error("Operator must be one of +, -, *, /, %, ^, **, sqrt, √, add, subtract, multiply, divide, modulo, power, or squareRoot.");
    process.exitCode = 1;
    return;
  }

  if (operator === "squareRoot") {
    if (!isUnaryOperation) {
      io.error("Square root expects exactly one operand.");
      process.exitCode = 1;
      return;
    }

    const value = Number(secondArg);

    if (Number.isNaN(value)) {
      io.error("The operand must be a valid number.");
      process.exitCode = 1;
      return;
    }

    if (value < 0) {
      io.error("Square root is not defined for negative numbers.");
      process.exitCode = 1;
      return;
    }

    const result = calculate(value, operator);
    io.log(result);
    process.exitCode = previousExitCode;
    return;
  }

  if (isUnaryOperation) {
    io.error("Binary operations require two operands.");
    process.exitCode = 1;
    return;
  }

  const left = Number(firstArg);
  const right = Number(thirdArg);

  if (Number.isNaN(left) || Number.isNaN(right)) {
    io.error("Both operands must be valid numbers.");
    process.exitCode = 1;
    return;
  }

  if ((operator === "division" || operator === "modulo") && right === 0) {
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
  modulo,
  normalizeOperator,
  power,
  printUsage,
  run,
  squareRoot
};
