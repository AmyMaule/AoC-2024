const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  data = data.split("\n").map(line => {
    line = line.split(": ");
    const target = Number(line[0]);
    const nums = line[1].split(" ").map(Number);
    return { target, nums };
  });

  console.log(part1(data));
  console.log(part2(data));
});

const part1 = (data) => {
  let correctCalibrations = 0;
  for (let line of data) {
    const { target, nums } = line;
    if (matchesTarget(target, nums)) correctCalibrations += target;
  }
  return correctCalibrations;
}

const matchesTarget = (target, nums, i = 0, currentValue = nums[0], concatenation) => {
  if (i < nums.length - 1 && currentValue > target) {
    return false;
  } else if (i === nums.length - 1) {
    return currentValue === target;
  }

  const nextValue = nums[i + 1];
  return (
    matchesTarget(target, nums, i + 1, currentValue + nextValue, concatenation) ||
    matchesTarget(target, nums, i + 1, currentValue * nextValue, concatenation) || 
    (concatenation && matchesTarget(target, nums, i + 1, Number(currentValue.toString() + nextValue.toString()), true))
  )
}

const part2 = (data) => {
  let correctCalibrations = 0;
  for (let line of data) {
    const { target, nums } = line;
    if (matchesTarget(target, nums, 0, nums[0], true)) {
      correctCalibrations += target;
      continue;
    }
  }
  return correctCalibrations;
}
