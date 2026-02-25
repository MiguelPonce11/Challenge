const { createRateLimiter } = require('./rateLimiter');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('TEST 1: Límite básico');
  const limiter = createRateLimiter(3, 1000);

  console.log(limiter('user1')); // true
  console.log(limiter('user1')); // true
  console.log(limiter('user1')); // true
  console.log(limiter('user1')); // false
  

  console.log('\nTEST 2: Múltiples usuarios');
  const limiter2 = createRateLimiter(2, 1000);

  console.log(limiter2('A')); // true
  console.log(limiter2('A')); // true
  console.log(limiter2('A')); // false
  console.log(limiter2('B')); // true
  console.log(limiter2('B')); // true
  console.log(limiter2('B')); // false

  console.log('\nTEST 3: Sliding Window');
  const limiter3 = createRateLimiter(2, 500);

  console.log(limiter3('user3')); // true
  console.log(limiter3('user3')); // true
  console.log(limiter3('user3')); // false

  await sleep(600);

  console.log(limiter3('user3')); // true (ventana expiró)
}

if (require.main === module) {
  runTests();
}