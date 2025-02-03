const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const stones = data.split(" ");
  console.log("Part 1:", calcTotalStones(stones, 25));
  console.log("Part 2:", calcTotalStones(stones, 75));
});

const findAndUpdate = (value, stones, qty) => {
  const existingStone = stones.find(stone => stone.value === value);
  if (existingStone) {
    existingStone.qty += qty;
  } else {
    stones.push({ value: value, qty: qty });
  }
  return stones;
}

const calcTotalStones = (stones, iterations) => {
  // Structure of each stone: { value: 2024, qty: 1 }
  let currentStones = [];

  stones.forEach(stone => {
    const existingStone = currentStones.find(currentStone => currentStone.value === stone);
    if (existingStone) {
      existingStone.qty += 1;
    } else {
      currentStones.push({ value: stone, qty: 1 })
    }
    });

  for (let blinks = 0; blinks < iterations; blinks++) {
    let ongoingIteration = [];
    for (let i = 0; i < currentStones.length; i++) {
      const stone = currentStones[i];

      if (stone.value === "0") {
        ongoingIteration = findAndUpdate("1", ongoingIteration, stone.qty);
      } else if (stone.value.length % 2 === 0) {
        let half = Math.floor(stone.value.length / 2);
        let firstHalf = stone.value.slice(0, half);
        let secondHalf = stone.value.slice(half);
        while (secondHalf.length > 1 && secondHalf[0] === "0") {
          secondHalf = secondHalf.slice(1);
        }
        ongoingIteration = findAndUpdate(firstHalf, ongoingIteration, stone.qty);
        ongoingIteration = findAndUpdate(secondHalf, ongoingIteration, stone.qty);
      } else {
        ongoingIteration = findAndUpdate((Number(stone.value) * 2024).toString(), ongoingIteration, stone.qty);
      }

      // At the end of each iteration, flush into currentStones and start iterating again
      if (i === currentStones.length - 1) {
        currentStones = [...ongoingIteration];
        break;
      }
    }
  }

  return currentStones.reduce((acc, curr) =>  acc + curr.qty, 0);
}
