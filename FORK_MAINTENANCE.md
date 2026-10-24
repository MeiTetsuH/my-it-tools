# Fork maintenance notes

Recorded maintenance baseline: 2026-10-24. This is a snapshot, not a promise that upstream or advisory data is still current.

- Upstream: [https://github.com/CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)
- Integrated upstream commit: [`d505845f918e946ec300af7b36efc107e2f66e9e`](https://github.com/CorentinTh/it-tools/commit/d505845f918e946ec300af7b36efc107e2f66e9e)
- Verified maintenance code commit: `b19c01d38738708f016c296068c3bb6925d37fdb`
- Deployment branch: `main`

This fork is a static personal tool deployment with a noindex policy and application-level mitigations for dependencies that still lack upstream fixes.

## Preserve these fork differences

| Paths | Intent |
| --- | --- |
| `vercel.json` | Keep the noindex header and static SPA filesystem/fallback routing. |
| `src/tools/pdf-signature-checker/` | Keep certificate-metadata-only parsing, the explicit unverified state, error handling, and tests that ensure the signature verifier is never called. |
| `src/tools/pdf-signature-checker/components/pdf-signature-details.vue; locales/*.yml` | Certificate fields must not silently reintroduce valid/trusted badges. Keep the unverified wording consistent in the UI and translations. |
| `src/main.ts, vite.config.ts, package.json` | Keep compatible Vue I18n compiler/runtime and the maintained Unhead/Vue integration. |
| `.github/workflows/e2e-tests.yml, playwright.config.ts, .nvmrc, Dockerfile` | Keep the installed-version Playwright cache key, supported browser installation order, and Node baseline. |
| `src/tools/dependency-security.e2e.spec.ts; src/ui/c-markdown/c-markdown.test.ts` | Preserve the actual browser/security regression coverage, including sanitized Markdown and dependency upgrades. |

See [PDF fixture provenance](src/tools/pdf-signature-checker/fixtures/README.md). The fork Docker nightly workflow was intentionally left paused in GitHub settings; a branch push can reactivate fork-disabled workflows, so recheck that setting during future releases.

## Dependency and runtime baseline

Use pnpm 9.11.0 and `pnpm-lock.yaml`; Node `.nvmrc` is 24.22.1 with `>=24.22.1 <25`. Recorded versions include Vue 3.5.44, Vue I18n 11.4.16, Tiptap 3.32.0, DOMPurify 3.4.17, Vite 6.4.5, Vitest 5.0.5 and Playwright 1.64.1.

The PDF tool reads embedded certificate information only. It does not establish document authenticity, integrity, signature validity, certificate trust, or revocation status. Keep the public fixture provenance in its fixture README. The optional Vue 2 compiler peer of unplugin-icons is removed because this application uses Vue 3; this is not an audit-ignore rule. Build-only imports/type checking remain devDependencies.

The manifest and committed lockfile are authoritative for exact dependency resolution. Review both direct and transitive changes; avoid mixing package managers.

## Resolution policy and removal conditions

| Scoped selection | Current declaration | Reason |
| --- | --- | --- |
| `minimatch@>=9.0.0 <9.0.7` | `^9.0.9` | Patch vulnerable file matching in the supported major. |
| `serialize-javascript@<7.0.5` | `^7.0.5` | Select the reviewed serializer security correction. |
| `postcss-selector-parser@<7.1.6` | `^7.1.6` | Patch the selector parser. |
| `ip-address@<10.7.4` | `^10.7.4` | Patch address parsing. |
| `deepmerge-ts@<8.0.0` | `^8.0.0` | Retain the reviewed merge-library safety update and compatibility tests. |
| `unplugin-icons>vue-template-compiler` | `-` | Remove the unused optional Vue 2 peer from this Vue 3 app; restore only if an actual supported Vue 2 consumer is introduced. |

For every entry above, remove or narrow it only after the parent dependency naturally resolves a patched compatible version, a fresh lockfile proves the vulnerable path is absent, the affected tests pass, and the relevant application/docs/MCP build passes. Change one dependency family at a time. Preserve parent-specific major-version constraints. Do not use audit suppression or a fabricated package version as a substitute for a fix.

## Known limitations at this baseline

node-forge 1.4.0 still has an unfixed high-severity advisory (GHSA-86w9-cpqp-85rv). Bypassing its affected signature-verification path is an application mitigation, not a library fix. Restore verification only after a maintained implementation and meaningful verification/trust regression tests are reviewed; do not implement custom cryptography. RSA key generation is retained and is not claimed to repair the upstream library.

## Future upstream sync and release

1. Compare upstream changes against the preserved paths above and keep unrelated local work intact.
2. Use the repository package manager and lockfile; review scoped overrides and affected regression tests.
3. Keep source checks, CI, provider build readiness, live-page checks, and external-service behavior as separate evidence.
4. Inspect added files and diffs for credentials before publishing. Store real credentials, deployment addresses for private services, user data and environment values outside Git.
5. After the reviewed commit is deployed, verify the intended domain and indexing policy. Remove only task-created branches that are already merged; preserve unrelated and unmerged branches.
