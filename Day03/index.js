const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  console.log(part1(data));
  console.log(part2(data));
});

const handleMult = (data, i, doCommand) => {
  let nums = "";
  for (let j = i; j < data.length; j++) {
    // If a new multiplication begins without a closing bracket, break the loop
    if (data[j] === ")" || nums.includes("mul(")) break;
    nums += data[j];
  }
  nums = nums.split(",");
  if (nums.every(num => !isNaN(Number(num))) && nums.length === 2) {
    if (doCommand) return parseInt(nums[0]) * parseInt(nums[1])
  }
  return 0;
};

const part1 = (data) => {
  let results = 0;
  let last4 = "";

  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (last4.length < 4) {
      last4 += char;
    } else {
      if (last4 === "mul(") {
        results += handleMult(data, i, true);
        last4 = "";
      } else {
        last4 = last4.slice(1) + char;
      }
    }
  }
  return results;
};

const part2 = (data) => {
  let results = 0;
  let last4 = "";
  let doCommand = true;

  for (let i = 0; i < data.length; i++) {
    const char = data[i];
    if (last4.length < 4) {
      last4 += char;
    } else {
      if (last4 === "don'" && data.slice(i).startsWith("t()")) {
        doCommand = false;
      } else if (last4 === "do()") {
        doCommand = true;
      }

      if (last4 === "mul(") {
        results += handleMult(data, i, doCommand);
        last4 = "";
      } else {
        last4 = last4.slice(1) + char;
      }
    }
  }
  return results;
};
