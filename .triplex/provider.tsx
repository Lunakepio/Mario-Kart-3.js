import React from "react";
import { Physics } from "@react-three/rapier";

export default function Provider({
  children,
  physicsDisabled = true,
}: {
  children: React.ReactNode;
  physicsDisabled?: boolean;
}) {
  return (
    <Physics gravity={[0, -90, 0]} timeStep="vary" paused={physicsDisabled}>
      {children}
    </Physics>
  );
}
