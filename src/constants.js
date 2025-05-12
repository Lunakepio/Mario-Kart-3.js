export const kartSettings = {
  speed: {
    min: -10,
    max: 30,
    default: 0,
  },

};

export const drifts = {
  level3: {
    name: "purple",
    threshold: 6,
    color: "#b100ff",
    nbParticles: 25,
  },
    level2: {
    name: "yellow",
    threshold: 3,
    color: "#FFA22B",
    nbParticles: 5,
  },
  level1: {
    name: "blue",
    threshold: 1,
    color: "#00ffff",
    nbParticles: 15,
  },

};

const driftLevels = Object.values(drifts).sort(
  (a, b) => b.threshold - a.threshold
);

export const getDriftLevel = (power) => {
  for (const level of driftLevels) {
    if (power >= level.threshold) {
      return level;
    }
  }

  return {
    name: "none",
    color: "#ffffff",
    nbParticles: 5,
  };
};
