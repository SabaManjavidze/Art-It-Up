export interface Text2Img {
  status: string;
  generationTime: number;
  id: number;
  output: string[];
  meta: Meta;
}

export interface Meta {
  H: number;
  W: number;
  enable_attention_slicing: string;
  file_prefix: string;
  guidance_scale: number;
  model: string;
  n_samples: number;
  negative_prompt: string;
  outdir: string;
  prompt: string;
  revision: string;
  safetychecker: string;
  seed: number;
  steps: number;
  vae: string;
}
