# Changelog

## Unreleased

- Refuse invalid video polling intervals and timeouts before any status request; intervals below one second or above Node's safe timer range can flood status checks.
- Reject an explicitly empty or invalid `apiKey` instead of silently using an ambient `AIWAVE_API_KEY`. Omitting the option or passing `undefined` still uses the AIWave environment key.
- Reject empty, whitespace-only, or non-string video prompts locally before sending a paid submission.
- Narrow the package description to supported routes; compatibility depends on the requested API operation.

## v0.2.1 (2026-11-08)

- Fix API-key isolation: only an explicit `apiKey` or `AIWAVE_API_KEY` is accepted. `OPENAI_API_KEY` is never borrowed from another provider, and an undefined `apiKey` option cannot override the resolved AIWave key.
- Migration: if you previously relied on `OPENAI_API_KEY`, set `AIWAVE_API_KEY` to your AIWave-issued key or pass that key explicitly. Do not copy another provider's key.
- Reject video submissions without a usable task ID. Timeout guidance now preserves the task ID and asks users to check status and usage before resubmitting.
- Fix TypeScript declarations for CommonJS, ESM, named imports, and the exported VideoAPI constructor.
- Add synthetic regression and declaration checks on Node 18, 20, and 22. No paid model requests are required for these checks.

## v0.2.0 (2026-11-04)

- **AI video support** — `client.video.generate({ model, prompt })` submits a job, `client.video.status(taskId)` checks it, `client.video.wait(taskId)` polls until done (15 min default timeout, throws on upstream failure)
- Video catalog IDs: Kling, Seedance, Hailuo, Wan, Vidu (availability depends on the key and route)
- Corrected catalog figures: 97 model IDs on the public rate card across 10 Chinese families and other providers (was "48 models"); catalog presence does not prove route access or health
- `MODEL_REFERENCE.md` is now auto-generated from the live public pricing endpoint — regenerate with `python3 scripts/gen_model_reference.py` instead of editing by hand
- TypeScript definitions for the video API

## v0.1.0 (2026-06-20)

- Initial release
- OpenAI-compatible client (`aiwave.AIWave`)
- Support for 50+ Chinese AI models via one API key
- Chat completions with streaming support
- Environment variable configuration (`AIWAVE_API_KEY`)

[Get started →](https://aiwave.live)
