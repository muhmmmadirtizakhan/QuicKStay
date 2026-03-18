export const seededShuffle = (items = [], seed = "") => {
  if (!Array.isArray(items)) return [];
  const list = items.filter(Boolean);
  if (list.length <= 1) return list;

  // Simple string hash to create a deterministic seed.
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  const rng = () => {
    // Linear congruential generator (deterministic)
    hash = (hash * 1664525 + 1013904223) | 0;
    return (hash >>> 0) / 4294967296;
  };

  const shuffled = list.slice();
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getDeterministicImage = (items = [], seed = "") => {
  const shuffled = seededShuffle(items, seed);
  return shuffled[0] || items[0];
};

export const hashStringToIndex = (value = "", modulo = 1) => {
  if (!value || modulo <= 0) return 0;
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % modulo;
};

export const getRotatingImage = (items = [], index = 0, seed = "") => {
  if (!Array.isArray(items) || items.length === 0) return undefined;
  const offset = hashStringToIndex(seed, items.length);
  return items[(index + offset) % items.length];
};
