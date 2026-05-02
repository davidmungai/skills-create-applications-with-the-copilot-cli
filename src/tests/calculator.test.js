const { calculate, normalizeOperator, run } = require("../calculator");

describe("normalizeOperator", () => {
  test.each([
    ["+", "addition"],
    ["add", "addition"],
    ["-", "subtraction"],
    ["subtract", "subtraction"],
    ["*", "multiplication"],
    ["x", "multiplication"],
    ["X", "multiplication"],
    ["multiply", "multiplication"],
    ["/", "division"],
    ["divide", "division"],
    ["%", "modulo"],
    ["mod", "modulo"],
    ["modulo", "modulo"],
    ["**", "power"],
    ["^", "power"],
    ["pow", "power"],
    ["power", "power"],
    ["sqrt", "squareRoot"],
    ["squareRoot", "squareRoot"]
  ])("maps %s to %s", (input, expected) => {
    expect(normalizeOperator(input)).toBe(expected);
  });

  it("returns undefined for unsupported operators", () => {
    expect(normalizeOperator("@")).toBeUndefined();
  });
});

describe("calculate", () => {
  test.each([
    [2, "addition", 3, 5],
    [10, "subtraction", 4, 6],
    [45, "multiplication", 2, 90],
    [20, "division", 5, 4],
    [-3, "addition", 7, 4],
    [9, "subtraction", -1, 10],
    [-6, "multiplication", 3, -18],
    [7.5, "division", 2.5, 3],
    [10, "modulo", 3, 1],
    [17, "modulo", 5, 2],
    [2, "power", 10, 1024],
    [3, "power", 3, 27],
    [9, "squareRoot", undefined, 3],
    [25, "squareRoot", undefined, 5]
  ])("returns %p for %p %p %p", (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  it("throws for division by zero", () => {
    expect(() => calculate(10, "division", 0)).toThrow("Division by zero is not allowed.");
  });

  it("throws for modulo by zero", () => {
    expect(() => calculate(10, "modulo", 0)).toThrow("Modulo by zero is not allowed.");
  });

  it("throws for square root of a negative number", () => {
    expect(() => calculate(-4, "squareRoot", undefined)).toThrow("Square root of a negative number is not allowed.");
  });

  it("throws for an unsupported operation", () => {
    expect(() => calculate(10, "unknown", 3)).toThrow("Unsupported operation.");
  });
});

describe("run", () => {
  function createIo() {
    return {
      log: jest.fn(),
      error: jest.fn()
    };
  }

  afterEach(() => {
    delete process.exitCode;
  });

  test.each([
    [["2", "+", "3"], 5],
    [["10", "-", "4"], 6],
    [["45", "*", "2"], 90],
    [["20", "/", "5"], 4],
    [["10", "%", "3"], 1],
    [["2", "**", "10"], 1024],
    [["9", "sqrt"], 3],
    [["25", "squareRoot"], 5]
  ])("prints the result for %j", (args, expected) => {
    const io = createIo();

    run(args, io);

    expect(io.log).toHaveBeenCalledWith(expected);
    expect(io.error).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  it("prints usage when the argument count is invalid", () => {
    const io = createIo();

    run(["2", "+"], io);

    expect(io.log).toHaveBeenNthCalledWith(1, "Usage: node src/calculator.js <number> <operator> [<number>]");
    expect(io.log).toHaveBeenNthCalledWith(2, "Example: node src/calculator.js 8 + 2");
    expect(process.exitCode).toBe(1);
  });

  it("reports invalid numbers", () => {
    const io = createIo();

    run(["foo", "+", "3"], io);

    expect(io.error).toHaveBeenCalledWith("Both operands must be valid numbers.");
    expect(process.exitCode).toBe(1);
  });

  it("reports invalid operators", () => {
    const io = createIo();

    run(["2", "@", "3"], io);

    expect(io.error).toHaveBeenCalledWith("Operator must be one of +, -, *, /, %, **, add, subtract, multiply, divide, mod, pow, sqrt.");
    expect(process.exitCode).toBe(1);
  });

  it("reports division by zero", () => {
    const io = createIo();

    run(["10", "/", "0"], io);

    expect(io.error).toHaveBeenCalledWith("Division by zero is not allowed.");
    expect(process.exitCode).toBe(1);
  });

  it("reports modulo by zero", () => {
    const io = createIo();

    run(["10", "%", "0"], io);

    expect(io.error).toHaveBeenCalledWith("Modulo by zero is not allowed.");
    expect(process.exitCode).toBe(1);
  });

  it("reports square root of a negative number", () => {
    const io = createIo();

    run(["-4", "sqrt"], io);

    expect(io.error).toHaveBeenCalledWith("Square root of a negative number is not allowed.");
    expect(process.exitCode).toBe(1);
  });
});
