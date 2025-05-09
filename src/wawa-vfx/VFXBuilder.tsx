import { button, folder, useControls } from "leva";
import { useEffect, useRef } from "react";
import { VFXEmitterSettings } from "./VFXEmitter";

interface VFXBuilderEmitterProps {
  settings?: VFXEmitterSettings;
  onChange: (settings: VFXEmitterSettings) => void;
  onRestart: () => void;
}

export const VFXBuilderEmitter: React.FC<VFXBuilderEmitterProps> = ({
  settings,
  onChange,
  onRestart,
}) => {
  useControls("⚙️ Emitter Settings", {
    Restart: button(() => onRestart()),
    Export: button(() => {
      const exportValues = JSON.stringify(vfxSettingsClone.current);
      console.log("📋 Values saved to clipboard: ", exportValues);
      navigator.clipboard.writeText(exportValues);
    }),
  });

  const [{ ...vfxSettings }, set] = useControls(() => ({
    "🪄 Emitter": folder({
      duration: 4,
      delay: 0,
      nbParticles: 2000,
      spawnMode: {
        options: ["time", "burst"],
        value: "time",
      },
      loop: false,
      startPositionMin: {
        value: [-1, -1, -1],
        min: -10,
        max: 10,
        step: 0.1,
        label: "startPositionMin",
      },
      startPositionMax: {
        value: [1, 1, 1],
        min: -10,
        max: 10,
        step: 0.1,
        label: "startPositionMax",
      },
      startRotationMin: {
        value: [0, 0, 0],
        min: -Math.PI * 2,
        max: Math.PI * 2,
        step: 0.1,
        label: "startRotationMin",
      },
      startRotationMax: {
        value: [0, 0, 0],
        min: -Math.PI * 2,
        max: Math.PI * 2,
        step: 0.1,
        label: "startRotationMax",
      },
    }),
    "✨ Particles": folder({
      particlesLifetime: {
        value: [0.1, 1],
        min: 0.0,
        max: 10,
        step: 0.1,
        label: "lifetime",
      },
    }),
    "🌪 Forces": folder({
      speed: {
        value: [5, 20],
        min: -100.0,
        max: 100,
      },
      directionMin: {
        value: [-1, -1, -1],
        min: -1,
        max: 1,
        step: 0.1,
      },
      directionMax: {
        value: [1, 1, 1],
        min: -1,
        max: 1,
        step: 0.1,
      },
      rotationSpeedMin: {
        value: [0, 0, 0],
        min: 0.0,
        max: 10,
        step: 0.1,
      },
      rotationSpeedMax: {
        value: [0, 0, 0],
        min: 0.0,
        max: 10,
        step: 0.1,
      },
    }),
    "🎨 Appearance": folder({
      nbColors: {
        options: [1, 2, 3],
      },
      colorStart: "#ffffff",
      colorEnd: "#ffffff",
      colorStart2: {
        value: "#ff0000",
        render: (get) => get("🎨 Appearance.nbColors") > 1,
      },
      colorEnd2: {
        value: "#ffffff",
        render: (get) => get("🎨 Appearance.nbColors") > 1,
      },
      colorStart3: {
        value: "#ff0000",
        render: (get) => get("🎨 Appearance.nbColors") > 2,
      },
      colorEnd3: {
        value: "#ff0000",
        render: (get) => get("🎨 Appearance.nbColors") > 2,
      },
      size: {
        value: [0.01, 1],
        min: 0.0,
        max: 5,
        step: 0.01,
        label: "size",
      },
    }),
  }));

  const {
    nbColors,
    colorStart2,
    colorEnd2,
    colorStart3,
    colorEnd3,
    ...builtSettings
  } = {
    ...vfxSettings,
    colorStart: [vfxSettings.colorStart],
    colorEnd: [vfxSettings.colorEnd],
  };

  vfxSettings.nbColors > 1 &&
    builtSettings.colorStart.push(vfxSettings.colorStart2);
  vfxSettings.nbColors > 1 &&
    builtSettings.colorEnd.push(vfxSettings.colorEnd2);
  vfxSettings.nbColors > 2 &&
    builtSettings.colorStart.push(vfxSettings.colorStart3);
  vfxSettings.nbColors > 2 &&
    builtSettings.colorEnd.push(vfxSettings.colorEnd3);

  // Ugly hack to get the current settings in the export button
  const vfxSettingsClone = useRef(builtSettings);
  vfxSettingsClone.current = builtSettings;

  useEffect(() => {
    if (settings) {
      const builderSettings: any = {
        ...settings,
      };
      for (let i = 0; i < 2; i++) {
        if (settings.colorStart && settings.colorStart.length > i) {
          builderSettings[i === 0 ? "colorStart" : `colorStart${i + 1}`] =
            settings.colorStart[i];
          builderSettings.nbColors = i + 1;
        }
        if (settings.colorEnd && settings.colorEnd.length > i) {
          builderSettings[i === 0 ? "colorEnd" : `colorEnd${i + 1}`] =
            settings.colorEnd[i];
        }
      }

      set({
        ...builderSettings,
      });
    }
  }, [settings]);

  onChange(builtSettings as VFXEmitterSettings);

  return null;
};
