export function isNumeric(value) {
  return !isNaN(value);
}

export function isNotNumeric(value) {
  return isNaN(value);
}

export function isWhole(value) {
  return value % 1 === 0;
}

// checks if value is whole or decimal number (can only contain .5 if decimal)
// example valid input: 1, 1.5, 1.50
// example invalid input: 1.1, 1.05, 1.60
export function isWholeOrHalf(value) {
  return value % 1 === 0 || value % 1 === 0.5;
}
