const fs = require("fs");
const inputText = "./input.txt";

fs.readFile(inputText, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  data = data.split(/\s+/);
  const lists = [[], []];  
  for (let i = 0; i < data.length; i++) {
    lists[i % 2].push(Number(data[i]));
  }

  console.log(part1(lists));
  console.log(part2(lists));
});


const part1 = (lists) => {
  lists = lists.map(list => list.sort());
  return lists[0].reduce((acc, curr, index) => {
    const diff = Math.abs(lists[1][index] - curr);
    return acc + diff;
  }, 0);
}

const part2 = (lists) => {
  let similarityScore = 0;
  lists[0].forEach(num => {
    similarityScore += (lists[1].filter(item => item === num).length * num);
  })
  return similarityScore;
}
