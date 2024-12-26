const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  const lockKeyData = {
    locks: [],
    keys: []
  };

  data.split("\n\n").forEach(group => {
    const rows = group.split("\n");
    let topRow = rows.shift().split("");
    let bottomRow = rows.pop().split("");
    
    let zeroPinHeights = new Array(rows[0].length).fill(0);
    const pinHeights = rows.reduce((heights, row) => {
      row.split("").forEach((char, i) => {
        if (char === "#") heights[i]++;
      });
      return heights;
    }, zeroPinHeights);
    
    let isLock = topRow.every(item => item === "#") && bottomRow.every(item => item === ".");
    let isKey = topRow.every(item => item === ".") && bottomRow.every(item => item === "#");
    if (isLock) lockKeyData.locks.push(pinHeights);
    if (isKey) lockKeyData.keys.push(pinHeights);
  })

  console.log(part1(lockKeyData));
  // console.log(part2(data));
  // part2(data);
});


const part1 = (lockKeyData) => {
  const { locks, keys } = lockKeyData;
  let pairs = 0;
  locks.forEach(lock => {
    keys.forEach(key => {
      const hasOverlap = lock.some((pin, index) => pin + key[index] > 5);
      if (!hasOverlap) pairs++;
    });
  });
  return pairs;
}

// const part2 = (data) => {}