import { useProgress } from "@react-three/drei"

export const LoadingScreen = () => {
    const { active, progress, errors, item, loaded, total } = useProgress()

    return (
        <div className="loading-screen">
            {progress}
        </div>
    )
}