/**
 * Game Logic for Banker and Robber
 * Role distribution based on player count
 */

// Role configuration based on player count
const ROLE_CONFIG = {
  5: { bankers: 3, robbers: 1, mastermind: 1 },
  6: { bankers: 4, robbers: 1, mastermind: 1 },
  7: { bankers: 4, robbers: 2, mastermind: 1 },
  8: { bankers: 5, robbers: 2, mastermind: 1 },
  9: { bankers: 5, robbers: 3, mastermind: 1 },
  10: { bankers: 6, robbers: 3, mastermind: 1 },
};

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array (mutates original)
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Get role configuration for a given player count
 * @param {number} playerCount - Number of players (5-10)
 * @returns {Object|null} - Role configuration or null if invalid
 */
export function getRoleConfig(playerCount) {
  return ROLE_CONFIG[playerCount] || null;
}

/**
 * Assign roles to players
 * @param {Array<{id: string, name: string}>} players - Array of player objects
 * @returns {Array<Object>} - Players with assigned roles
 */
export function assignRoles(players) {
  const playerCount = players.length;
  const config = getRoleConfig(playerCount);

  if (!config) {
    throw new Error(`Invalid player count: ${playerCount}. Must be between 5 and 10.`);
  }

  // Create role pool
  const roles = [
    ...Array(config.bankers).fill('banker'),
    ...Array(config.robbers).fill('robber'),
    'mastermind',
  ];

  // Shuffle roles
  const shuffledRoles = shuffleArray(roles);

  // Find robber team members for role info
  const robberIndices = [];
  let mastermindIndex = -1;

  shuffledRoles.forEach((role, index) => {
    if (role === 'robber') robberIndices.push(index);
    if (role === 'mastermind') mastermindIndex = index;
  });

  // Assign roles to players with team knowledge
  return players.map((player, index) => {
    const role = shuffledRoles[index];
    const roleInfo = {
      ...player,
      role,
      team: role === 'banker' ? 'banker' : 'robber',
      teamMembers: [],
      mastermind: null,
    };

    // Robbers and Mastermind know each other
    if (role === 'robber' || role === 'mastermind') {
      // Get all robber team members (robbers + mastermind)
      const allRobberTeam = [...robberIndices, mastermindIndex];
      roleInfo.teamMembers = allRobberTeam
        .filter(i => i !== index) // Exclude self
        .map(i => ({
          name: players[i].name,
          role: shuffledRoles[i],
        }));

      // Robbers specifically know who the mastermind is
      if (role === 'robber') {
        roleInfo.mastermind = players[mastermindIndex].name;
      }

      // In 5-6 player games, Mastermind knows the Robbers
      // In 7+ player games, Mastermind doesn't know who the Robbers are
      if (role === 'mastermind' && playerCount >= 7) {
        roleInfo.teamMembers = []; // Mastermind is blind in larger games
        roleInfo.blindMastermind = true;
      }
    }

    return roleInfo;
  });
}

/**
 * Generate a random room code
 * @returns {string} - 6-character uppercase room code
 */
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Validate player count
 * @param {number} count - Player count to validate
 * @returns {Object} - { valid: boolean, message: string }
 */
export function validatePlayerCount(count) {
  if (count < 5) {
    return { valid: false, message: `Need ${5 - count} more player${5 - count > 1 ? 's' : ''} to start` };
  }
  if (count > 10) {
    return { valid: false, message: 'Maximum 10 players allowed' };
  }
  return { valid: true, message: 'Ready to start!' };
}
