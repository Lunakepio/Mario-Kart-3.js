import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

export const useCurvedPathPoints = (jsonPath) => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPointsFromJson = async () => {
      try {
        const response = await fetch(jsonPath);
        const data = await response.json();
        setPoints(data.points.map(point => new THREE.Vector3(point.x, point.y, point.z)));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    loadPointsFromJson();
  }, [jsonPath]);

  return { points, loading, error };
};