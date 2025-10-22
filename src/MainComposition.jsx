/**
 * Main Video Composition
 * Orchestrates scene transitions like GitHub Unwrapped
 * 
 * Features:
 * - Series.Sequence with negative offsets for smooth transitions
 * - Dynamic duration calculation
 * - Modular scene system
 * - Broadcast-grade transitions
 */

import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile } from 'remotion';
import { HookTemplate, HOOK_DURATION, HOOK_EXIT_TRANSITION } from './templates/HookTemplate';
import { ExplainTemplate, EXPLAIN_DURATION, EXPLAIN_EXIT_TRANSITION } from './templates/ExplainTemplate';
import { ApplyTemplate, APPLY_DURATION, APPLY_EXIT_TRANSITION } from './templates/ApplyTemplate';
import { ReflectTemplate } from './templates/ReflectTemplate';

// Scene durations (in frames at 30fps)
const REFLECT_DURATION = 30 * 30; // 30 seconds
const REFLECT_EXIT_TRANSITION = 10;

// Opening overlap (like GitHub Unwrapped)
const OPENING_OVERLAP = 10;

/**
 * Calculate total video duration based on scenes
 */
export const calculateDuration = (scenes) => {
  const hookDuration = scenes.hook ? HOOK_DURATION - HOOK_EXIT_TRANSITION : 0;
  const explainDuration = scenes.explain ? EXPLAIN_DURATION - EXPLAIN_EXIT_TRANSITION : 0;
  const applyDuration = scenes.apply ? APPLY_DURATION - APPLY_EXIT_TRANSITION : 0;
  const reflectDuration = scenes.reflect ? REFLECT_DURATION - REFLECT_EXIT_TRANSITION : 0;

  return (
    hookDuration +
    explainDuration +
    applyDuration +
    reflectDuration +
    OPENING_OVERLAP
  );
};

/**
 * Main composition that stitches all scenes together
 * Any Hook variant → Any Explain variant → Any Apply variant → Any Reflect variant
 */
export const MainComposition = ({ scenes }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#060842',
      }}
    >
      {/* Background music (optional - scaffolded for future) */}
      {/* <Audio src={staticFile('background-music.mp3')} /> */}

      <Series>
        {/* HOOK Scene */}
        {scenes.hook && (
          <Series.Sequence durationInFrames={HOOK_DURATION}>
            <HookTemplate scene={scenes.hook} />
          </Series.Sequence>
        )}

        {/* EXPLAIN Scene - Overlaps for smooth transition */}
        {scenes.explain && (
          <Series.Sequence
            durationInFrames={EXPLAIN_DURATION}
            offset={scenes.hook ? -HOOK_EXIT_TRANSITION : 0}
          >
            <ExplainTemplate scene={scenes.explain} />
          </Series.Sequence>
        )}

        {/* APPLY Scene - Overlaps for smooth transition */}
        {scenes.apply && (
          <Series.Sequence
            durationInFrames={APPLY_DURATION}
            offset={
              scenes.explain
                ? -EXPLAIN_EXIT_TRANSITION
                : scenes.hook
                ? -HOOK_EXIT_TRANSITION
                : 0
            }
          >
            <ApplyTemplate scene={scenes.apply} />
          </Series.Sequence>
        )}

        {/* REFLECT Scene - Overlaps for smooth transition */}
        {scenes.reflect && (
          <Series.Sequence
            durationInFrames={REFLECT_DURATION}
            offset={
              scenes.apply
                ? -APPLY_EXIT_TRANSITION
                : scenes.explain
                ? -EXPLAIN_EXIT_TRANSITION
                : scenes.hook
                ? -HOOK_EXIT_TRANSITION
                : 0
            }
          >
            <ReflectTemplate scene={scenes.reflect} />
          </Series.Sequence>
        )}
      </Series>
    </AbsoluteFill>
  );
};

/**
 * Calculate metadata for dynamic duration
 */
export const mainCalculateMetadata = ({ props }) => {
  return {
    durationInFrames: calculateDuration(props.scenes),
    props,
  };
};
