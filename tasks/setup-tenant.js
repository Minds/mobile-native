const args = process.argv.slice(2);

const tenant = args[0];

if (tenant) {
  console.log(`Setting up tenant ${tenant}`);

  // Implement tenant setup here
} else {
  console.log('No tenant provided, default to minds');
}
