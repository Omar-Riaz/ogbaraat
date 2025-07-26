export interface Guest {
  name: string;
  table: number;
}

export type GuestData = Record<string, string[]>;

export function fuzzySearch(guestData: GuestData, query: string): Guest[] {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  const allGuests: Guest[] = [];
  
  Object.entries(guestData).forEach(([tableNumber, guestNames]) => {
    guestNames.forEach(name => {
      allGuests.push({ name, table: parseInt(tableNumber) });
    });
  });
  
  return allGuests
    .map(guest => ({
      guest,
      score: calculateMatchScore(guest.name.toLowerCase(), normalizedQuery)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.guest);
}

function calculateMatchScore(name: string, query: string): number {
  if (name.includes(query)) {
    return name.indexOf(query) === 0 ? 100 : 80;
  }
  
  const nameWords = name.split(' ');
  const queryWords = query.split(' ');
  
  let score = 0;
  
  for (const queryWord of queryWords) {
    for (const nameWord of nameWords) {
      if (nameWord.startsWith(queryWord)) {
        score += 60;
      } else if (nameWord.includes(queryWord)) {
        score += 30;
      } else if (levenshteinDistance(nameWord, queryWord) <= 2) {
        score += 20;
      }
    }
  }
  
  return score;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}