const counters = new Map();

const increment = (name) => counters.set(name, (counters.get(name) || 0) + 1);
const snapshot = () => Object.fromEntries(counters);
const prometheus = () => [...counters.entries()]
    .map(([name, value]) => `datarheo_${name}_total ${value}`)
    .join("\n") + "\n";

module.exports = { increment, snapshot, prometheus };