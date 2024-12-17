const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  const parsedData = {};
  data = data.split("\n").map(line => {
    if (line.includes("Register")) {
      line = line.replace("Register ", "");
    }
    line = line.split(": ");
    if (line[0] === "Program") {
      line[1] = line[1].split(",").map(Number);
    } else line[1] = parseInt(line[1]);
    if (line[0]) parsedData[line[0]] = line[1];
  })

  console.log(part1(parsedData));
});

const part1 = (data) => {
  let output = [];
  let { A, B, C, Program: program } = data;
  let instructionPointer = 0;

  const getCombo = operand => {
    if (operand <= 3) return operand;
    if (operand === 4) return A;
    if (operand === 5) return B;
    if (operand === 6) return C;
  }
  
  const performInstruction = (opcode, operand) => {
    switch (opcode) {
      case 0:
        A = Math.trunc(A / (2 ** getCombo(operand)));
        break;
      case 1:
        B = B ^ operand;
        break;
      case 2:
        B = getCombo(operand) % 8;
        break;
      case 3:
        if (A !== 0) {
          instructionPointer = operand;
          return;
        }
        break;
      case 4:
        B = B ^ C;
        break;
      case 5:
        output.push(getCombo(operand) % 8);
        break;
      case 6:
        B = Math.trunc(A / (2 ** getCombo(operand)));
        break;
      case 7:
        C = Math.trunc(A / (2 ** getCombo(operand)));
        break;
    }
    instructionPointer += 2;
  }

  while (instructionPointer < program.length) {
    const opcode = program[instructionPointer];
    const operand = program[instructionPointer + 1];
    performInstruction(opcode, operand);
  }
  return output.join(",");
}
