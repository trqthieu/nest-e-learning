export function shuffleOrderWithinItems(data) {
  return data.map((item) => {
    // Extract the order value of the current item
    const { order } = item;
    // Create an array with values 0 to 3 except the current order value
    const orderValues = [0, 1, 2, 3].filter((val) => val !== order);
    // Shuffle the order values
    const shuffledOrderValues = shuffleArray(orderValues);
    // Assign the shuffled order value to the current item
    return { ...item, order: shuffledOrderValues[0] };
  });
}

function shuffleArray(array) {
  // Create a copy of the array to avoid modifying the original array
  const shuffledArray = [...array];

  // Start from the last element and swap it with a random element before it
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index between 0 and i
    // Swap elements at positions i and j
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}
