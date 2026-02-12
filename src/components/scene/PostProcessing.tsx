import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useStore } from '../../store/useStore';

export default function PostProcessing() {
  const quality = useStore((s) => s.postProcessingQuality);

  if (quality === 'off') return null;

  const isHigh = quality === 'high';

  return (
    <EffectComposer multisampling={isHigh ? 4 : 0}>
      <SSAO
        blendFunction={BlendFunction.MULTIPLY}
        samples={isHigh ? 32 : 16}
        radius={0.5}
        intensity={15}
        luminanceInfluence={0.5}
        color="#000000"
      />
      {isHigh && (
        <Bloom
          intensity={0.1}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.5}
        />
      )}
    </EffectComposer>
  );
}
