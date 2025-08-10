const fs = require("fs");
const inputTxt = "./input.txt";

fs.readFile(inputTxt, "utf8", (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  data = data.trim().split("\n").map(line => line.split("-"));
  const allConnections = new Map();

  const setConnection = (a, b) => {
    if (!allConnections.has(a)) {
      allConnections.set(a, new Set());
    }
    allConnections.get(a).add(b);
  };

  for (let [a, b] of data) {
    setConnection(a, b);
    setConnection(b, a);
  }

  console.log(part1(allConnections));
  console.log(part2(allConnections));
});

const part1 = allConnections => {
  const tripletConnections = new Set();

  for (let currentConnection of allConnections) {
    const [currentComputer, connectedComputers] = currentConnection;
    if (currentComputer.startsWith("t")) {
      for (let c of connectedComputers) {
        const commonConnections = [...allConnections.get(c)].filter(con => connectedComputers.has(con));
        commonConnections.forEach(connection => {
          const triplet = [currentComputer, c, connection].sort();
          tripletConnections.add(triplet.toString());
        })
      }
    }
  }
  return tripletConnections.size;
}

const part2 = allConnections => {
  let largestGroup = [];

  const findConnections = (remaining, currentGroup=[]) => {
    if (!remaining.length) {
      if (currentGroup.length > largestGroup.length) {
        largestGroup = [...currentGroup];
      }
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      if (currentGroup.every(c => allConnections.get(remaining[i]).has(c))) {
        const newGroup = [...currentGroup, remaining[i]];
        const nextCandidates = remaining.slice(i + 1).filter(n => newGroup.every(c => allConnections.get(n).has(c)));
        if (newGroup.length + nextCandidates.length <= largestGroup.length) continue;
        findConnections(nextCandidates, newGroup);
      }
    }
  };
  findConnections([...allConnections.keys()]);
  return largestGroup.sort().join(",");
};
