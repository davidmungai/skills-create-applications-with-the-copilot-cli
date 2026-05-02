const { calculate, modulo, normalizeOperator, power, run, squareRoot } = require("../calculator");

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
    ["modulo", "modulo"],
    ["^", "power"],
    ["**", "power"],
    ["power", "power"],
    ["sqrt", "squareRoot"],
    ["√", "squareRoot"],
    ["squareRoot", "squareRoot"]
  ])("maps %s to %s", (input, expected) => {
    expect(normalizeOperator(input)).toBe(expected);
  });

  it("returns undefined for unsupported operators", () => {
    expect(normalizeOperator("foo")).toBeUndefined();
  });
});

describe("calculate", () => {
  test.each([
    [2, "addition", 3, 5],
    [10, "subtraction", 4, 6],
    [45, "multiplication", 2, 90],
    [20, "division", 5, 4],
    [5, "modulo", 2, 1],
    [20, "modulo", 6, 2],
    [2, "power", 3, 8],
    [2, "power", 5, 32],
    [16, "squareRoot", undefined, 4],
    [81, "squareRoot", undefined, 9],
    [-3, "addition", 7, 4],
    [9, "subtraction", -1, 10],
    [-6, "multiplication", 3, -18],
    [7.5, "division", 2.5, 3]
  ])("returns %p for %p %p %p", (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  it("throws for division by zero", () => {
    expect(() => calculate(10, "division", 0)).toThrow("Division by zero is not allowed.");
  });

  it("throws for modulo by zero", () => {
    expect(() => calculate(10, "modulo", 0)).toThrow("Division by zero is not allowed.");
  });

  it("throws for the square root of a negative number", () => {
    expect(() => calculate(-1, "squareRoot")).toThrow("Square root is not defined for negative numbers.");
  });

  it("throws for an unsupported operation", () => {
    expect(() => calculate(10, "factorial", 3)).toThrow("Unsupported operation.");
  });
});

describe("standalone helpers", () => {
  it("calculates modulo", () => {
    expect(modulo(14, 5)).toBe(4);
  });

  it("calculates modulo for the image example", () => {
    expect(modulo(5, 2)).toBe(1);
  });

  it("calculates power", () => {
    expect(power(3, 4)).toBe(81);
  });

  it("calculates power for the image example", () => {
    expect(power(2, 3)).toBe(8);
  });

  it("calculates square root", () => {
    expect(squareRoot(49)).toBe(7);
  });

  it("calculates square root for the image example", () => {
    expect(squareRoot(16)).toBe(4);
  });

  it("rejects square root for negative numbers", () => {
    expect(() => squareRoot(-49)).toThrow("Square root is not defined for negative numbers.");
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
     [["5", "%", "2"], 1],
     [["20", "%", "6"], 2],
     [["2", "^", "3"], 8],
     [["2", "^", "5"], 32],
     [["√", "16"], 4],
     [["sqrt", "49"], 7]
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

    expect(io.log).toHaveBeenNthCalledWith(1, "Usage: node src/calculator.js <number> <operator> <number>");
    expect(io.log).toHaveBeenNthCalledWith(2, "   or: node src/calculator.js <operator> <number>");
    expect(io.log).toHaveBeenNthCalledWith(3, "Example: node src/calculator.js 8 + 2");
    expect(io.log).toHaveBeenNthCalledWith(4, "Example: node src/calculator.js sqrt 9");
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

    run(["2", "foo", "3"], io);

    expect(io.error).toHaveBeenCalledWith("Operator must be one of +, -, *, /, %, ^, **, sqrt, √, add, subtract, multiply, divide, modulo, power, or squareRoot.");
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

    expect(io.error).toHaveBeenCalledWith("Division by zero is not allowed.");
    expect(process.exitCode).toBe(1);
  });

  it("reports invalid square root input", () => {
    const io = createIo();

    run(["sqrt", "foo"], io);

    expect(io.error).toHaveBeenCalledWith("The operand must be a valid number.");
    expect(process.exitCode).toBe(1);
  });

  it("reports square root of a negative number", () => {
    const io = createIo();

    run(["sqrt", "-9"], io);

    expect(io.error).toHaveBeenCalledWith("Square root is not defined for negative numbers.");
    expect(process.exitCode).toBe(1);
  });

  it("reports extra operands for square root", () => {
    const io = createIo();

    run(["9", "sqrt", "3"], io);

    expect(io.error).toHaveBeenCalledWith("Square root expects exactly one operand.");
    expect(process.exitCode).toBe(1);
  });
});
