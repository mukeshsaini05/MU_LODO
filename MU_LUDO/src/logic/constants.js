// Board coordinates and paths for Ludo

export const COLORS = {
  RED: 'red',
  GREEN: 'green',
  YELLOW: 'yellow',
  BLUE: 'blue'
};

// Start positions (inside base) - centered 2x2 grid inside 6x6 base
export const START_POSITIONS = {
  [COLORS.RED]:    [{x: 2, y: 2}, {x: 3, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}],
  [COLORS.GREEN]:  [{x: 11, y: 2}, {x: 12, y: 2}, {x: 11, y: 3}, {x: 12, y: 3}],
  [COLORS.YELLOW]: [{x: 11, y: 11}, {x: 12, y: 11}, {x: 11, y: 12}, {x: 12, y: 12}],
  [COLORS.BLUE]:   [{x: 2, y: 11}, {x: 3, y: 11}, {x: 2, y: 12}, {x: 3, y: 12}],
};

// The safe zones where tokens cannot be killed (stars usually)
// Safe spots: starting cells + middle of quadrants
export const SAFE_ZONES = [
  {x: 1, y: 6},  // Red start
  {x: 6, y: 2},  // Red safe (middle of top-left quadrant path)
  {x: 8, y: 1},  // Green start
  {x: 12, y: 6}, // Green safe
  {x: 13, y: 8}, // Yellow start
  {x: 8, y: 12}, // Yellow safe
  {x: 6, y: 13}, // Blue start
  {x: 2, y: 8}   // Blue safe
];

// 15x15 Ludo board mapping
// The path a token takes from its start to home. 
// A single continuous array for the outer track
export const OUTER_PATH = [
  {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6}, // Red starting horizontal
  {x: 6, y: 5}, {x: 6, y: 4}, {x: 6, y: 3}, {x: 6, y: 2}, {x: 6, y: 1}, {x: 6, y: 0}, // Up to Green
  {x: 7, y: 0}, {x: 8, y: 0}, // Turn at top
  {x: 8, y: 1}, {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5}, // Green starting vertical down
  {x: 9, y: 6}, {x: 10, y: 6}, {x: 11, y: 6}, {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6}, // Right to Yellow
  {x: 14, y: 7}, {x: 14, y: 8}, // Turn at right
  {x: 13, y: 8}, {x: 12, y: 8}, {x: 11, y: 8}, {x: 10, y: 8}, {x: 9, y: 8}, // Yellow starting horizontal left
  {x: 8, y: 9}, {x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12}, {x: 8, y: 13}, {x: 8, y: 14}, // Down to Blue
  {x: 7, y: 14}, {x: 6, y: 14}, // Turn at bottom
  {x: 6, y: 13}, {x: 6, y: 12}, {x: 6, y: 11}, {x: 6, y: 10}, {x: 6, y: 9}, // Blue starting vertical up
  {x: 5, y: 8}, {x: 4, y: 8}, {x: 3, y: 8}, {x: 2, y: 8}, {x: 1, y: 8}, {x: 0, y: 8}, // Left to Red
  {x: 0, y: 7}, {x: 0, y: 6} // Turn at left back to start
];

// Generate exact path indexes for each color
export const COLOR_PATHS = {
  [COLORS.RED]: [
    ...OUTER_PATH.slice(0, 50),
    ...OUTER_PATH.slice(50, 51),
    // Home stretch
    {x: 1, y: 7}, {x: 2, y: 7}, {x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7}
  ],
  [COLORS.GREEN]: [
    ...OUTER_PATH.slice(13, 52),
    ...OUTER_PATH.slice(0, 12),
    // Home stretch
    {x: 7, y: 1}, {x: 7, y: 2}, {x: 7, y: 3}, {x: 7, y: 4}, {x: 7, y: 5}
  ],
  [COLORS.YELLOW]: [
    ...OUTER_PATH.slice(26, 52),
    ...OUTER_PATH.slice(0, 25),
    // Home stretch
    {x: 13, y: 7}, {x: 12, y: 7}, {x: 11, y: 7}, {x: 10, y: 7}, {x: 9, y: 7}
  ],
  [COLORS.BLUE]: [
    ...OUTER_PATH.slice(39, 52),
    ...OUTER_PATH.slice(0, 38),
    // Home stretch
    {x: 7, y: 13}, {x: 7, y: 12}, {x: 7, y: 11}, {x: 7, y: 10}, {x: 7, y: 9}
  ]
};

export const HOME_ZONES = {
  [COLORS.RED]: { x: 6, y: 7 },
  [COLORS.GREEN]: { x: 7, y: 6 },
  [COLORS.YELLOW]: { x: 8, y: 7 },
  [COLORS.BLUE]: { x: 7, y: 8 },
};
