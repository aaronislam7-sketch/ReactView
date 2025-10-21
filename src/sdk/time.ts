import {useVideoConfig} from 'remotion';

export const useTime = () => {

  const {fps} = useVideoConfig();

  const sec = (s: number) => Math.round(s * fps);

  const ms = (m: number) => Math.round((m / 1000) * fps);

  return {fps, sec, ms};

};
