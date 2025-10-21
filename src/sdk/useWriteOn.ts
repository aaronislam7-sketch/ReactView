import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';



type Opts = { delay?: number; stiffness?: number; damping?: number };



/**

 * Returns a strokeDashoffset from 1 -> 0 for write-on animations.

 */

export const useWriteOn = (opts: Opts = {}) => {

  const {delay = 0, stiffness = 120, damping = 200} = opts;

  const frame = useCurrentFrame();

  const {fps} = useVideoConfig();

  const s = spring({

    frame: Math.max(0, frame - delay),

    fps,

    config: {stiffness, damping},

  });

  return interpolate(s, [0, 1], [1, 0]);

};



1.7 

src/sdk/scene.schema.ts



import {z} from 'zod';



export const SceneSchema = z.object({

  schema_version: z.string(),

  template_id: z.string(),

  duration_s: z.number().positive(),

  fps: z.number().positive().optional(),

  meta: z.object({

    title: z.string().default(''),

    tags: z.array(z.string()).default([])

  }).optional(),

  style_tokens: z.object({

    colors: z.object({

      bg: z.string().optional(),

      accent: z.string().optional(),

    }).optional(),

    fonts: z.object({

      title: z.object({family: z.string().optional(), size: z.number().optional()}).optional(),

      body:  z.object({family: z.string().optional(), size: z.number().optional()}).optional(),

    }).optional(),

    motion: z.object({

      imperfection: z.number().min(0).max(1).optional(),

    }).optional(),

    texture: z.object({paper: z.boolean().optional(), chalk: z.number().min(0).max(1).optional()}).optional(),

    sfx: z.object({tick: z.boolean().optional()}).optional()

  }).optional(),

  layout: z.object({canvas: z.object({w: z.number(), h: z.number()})}),

  fill: z.object({

    texts: z.record(z.string()).default({}),

    images: z.record(z.string()).default({}),

  }),

  timeline: z.array(z.object({

    t: z.number(),

    action: z.string(),

    target: z.string().optional(),

    duration: z.number().optional()

  })).default([])

});



export type SceneData = z.infer<typeof SceneSchema>;
