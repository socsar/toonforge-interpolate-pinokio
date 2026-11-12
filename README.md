# ToonForge Interpolate

A Pinokio app that installs [ComfyUI](https://github.com/comfyanonymous/ComfyUI) plus
[kijai/ComfyUI-DynamiCrafterWrapper](https://github.com/kijai/ComfyUI-DynamiCrafterWrapper)
(which includes a **ToonCrafterDecode** node) and [ComfyUI-Manager](https://github.com/ltdrdata/ComfyUI-Manager),
tuned to launch on Apple Silicon via PyTorch's MPS backend. This gives you cartoon/anime
**keyframe interpolation** — feed in two drawn frames (start + end), get the smooth
motion in between — the same idea as the original ToonCrafter research repo, but without
its `decord` dependency, which does not build on macOS. ComfyUI nodes take images directly,
so `decord` (only needed to read video files from disk in the original demo) is never
required here.

## Why this exists

This is the **"Interpolate" mode** half of a two-app pair:

- **ToonForge Interpolate** (this app) — two keyframes in, smooth cartoon motion out.
- **[Phosphene](https://github.com/mrbizarro/Phosphene)** — the **"Generate" mode**: text-to-video
  and image-to-video from scratch, fully offline on Apple Silicon. Install it separately
  the same way you installed this app (Pinokio → Discover → Download from URL →
  `https://github.com/mrbizarro/phosphene`). It already ships its own, more complex
  installer — there's no need to duplicate that here, and the two apps simply sit next to
  each other in your Pinokio dashboard.
- **Only use LTX-2.5 inside Phosphene, not MiniMax H3.** MiniMax H3's own model license
  excludes the EU, UK, South Korea and the US — skip that model in Phosphene's UI.

## First-time setup after Install

1. Click **Launch**. The first boot can take a minute while ComfyUI starts.
2. Inside ComfyUI, open the **Manager** button (installed via ComfyUI-Manager) and use its
   model browser/downloader to grab the DynamiCrafter/ToonCrafter checkpoint the
   **ToonCrafterDecode** node needs. Exact filenames change over time as the node author
   updates things, so check the current instructions in the
   [ComfyUI-DynamiCrafterWrapper README](https://github.com/kijai/ComfyUI-DynamiCrafterWrapper#readme)
   rather than relying on anything hardcoded here. As of this app's writing, the README
   points to bf16/safetensors conversions at
   [huggingface.co/Kijai/DynamiCrafter_pruned](https://huggingface.co/Kijai/DynamiCrafter_pruned),
   placed under `ComfyUI/models/checkpoints` (a subfolder is fine).
3. Load an example workflow: in ComfyUI-Manager, use the workflow browser, or open
   the [example_workflows folder](https://github.com/kijai/ComfyUI-DynamiCrafterWrapper/tree/main/example_workflows)
   of the node's own repo in your browser and drag the ToonCrafter/interpolation example
   `.json` onto the ComfyUI canvas. **This app does not ship a pre-built workflow graph** —
   node names/parameters in that project change between versions, and shipping a stale,
   hand-written graph risked giving you something that fails to load. Pulling the example
   straight from the node author is the reliable path.
4. In that workflow, replace the two example image-loader nodes with your own start/end
   cartoon frames, and run it.

## Hardware notes

- Any Apple Silicon Mac (M1 or newer) works; a MacBook Air or Mac mini is fine, just slower
  than a Pro/Max/Studio and more memory-constrained — keep resolution/frame count modest if
  you're on 8–16GB of unified memory.
- `PYTORCH_MPS_HIGH_WATERMARK_RATIO=0.0` is set to avoid MPS's default memory ceiling
  aborting longer runs; `--force-fp16` is passed on macOS to avoid some fp32/bf16 op
  gaps in PyTorch's MPS backend.

## Updating

Use the **Update** menu item to `git pull` ComfyUI, ComfyUI-Manager and the DynamiCrafter
node, and refresh their Python dependencies.
