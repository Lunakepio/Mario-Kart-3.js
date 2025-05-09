export const kartSettings = {
  speed: {
    min: -10,
    max: 40,
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
    name: "blue",
    threshold: 3,
    color: "#00e5ff",
    nbParticles: 15,
  },
  level1: {
    name: "yellow",
    threshold: 1,
    color: "#ffe600",
    nbParticles: 5,
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
