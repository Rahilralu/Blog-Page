setTimeout(() => console.log('setTimeout'), 0)      // → timers phase
setImmediate(() => console.log('setImmediate'))      // → check phase
process.nextTick(() => console.log('nextTick'))      // → nextTick queue
Promise.resolve().then(() => console.log('Promise')) // → Promise queue