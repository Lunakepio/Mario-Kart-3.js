import { useState, useEffect } from 'react'
import * as THREE from 'three'

interface Point {
  x: number
  y: number
  z: number
}

interface PointsData {
  points: Point[]
}

export const useCurvedPathPoints = (jsonPath: string) => {
  const [points, setPoints] = useState<THREE.Vector3[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadPointsFromJson = async () => {
      try {
        const response = await fetch(jsonPath)
        const data: PointsData = await response.json()
        setPoints(
          data.points.map(
            (point) => new THREE.Vector3(point.x, point.y, point.z)
          )
        )
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
      }
    }

    loadPointsFromJson()
  }, [jsonPath])

  return { points, loading, error }
}
