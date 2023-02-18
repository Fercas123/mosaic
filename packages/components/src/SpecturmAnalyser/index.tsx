import React from 'react';
import p5Types from 'p5';
import dynamic from 'next/dynamic';
// import styles from './styles.css';
const Sketch = dynamic(() => import('react-p5').then(mod => mod.default), { ssr: false });
const frequencyBands = [50, 200, 400, 1000];
// let audioContext;

export const SpectrumAnalyser = audioElem => {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(audioElem);

  let gainNode = audioContext.createGain();

  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.connect(audioContext.destination);

  let signals = frequencyBands.map(frequency => {
    const analyserNode = audioContext.createAnalyser();
    analyserNode.smoothingTimeConstant = 1;
    const analyserData = new Float32Array(analyserNode.fftSize);
    const filterNode = audioContext.createBiquadFilter();
    filterNode.frequency.value = frequency;
    filterNode.Q.value = 1;
    filterNode.type = 'bandpass';

    source.connect(filterNode);
    filterNode.connect(analyserNode);

    return {
      analyserNode,
      analyserData
    };
  });

  console.log(signals);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(75, 75).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    const x = 0;
    const y = 0;
    p5.background(100);
    p5.rect(x, y, 70, 70);
  };

  return <Sketch setup={setup} draw={draw} />;
};
