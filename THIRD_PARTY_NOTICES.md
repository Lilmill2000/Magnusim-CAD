# Third-party software and distribution

Magnusim CAD is the CAD edition of Magnusim, and its source is offered under
GPL-3.0-or-later (see LICENSE). That licence does not replace the licences of
its dependencies or of third-party source, assets or executables.

The sections below are Magnusim's own notices (its THIRD_PARTY_NOTICES.md), the
ones about what this repository holds and what Magnusim CAD ships.

## Magnusim CAD plugin

The CAD plugin (`magnusim-web/bundled-plugins/cad`, bundled and on by default)
is GPL-3.0-or-later. It ships two WebAssembly modules and two JavaScript
libraries:

- `workspace/kernel/mk32.wasm`: Open CASCADE Technology 7.9.3 (LGPL-2.1 with
  the Open CASCADE exception), including code under its own permissive notices:
  DELABELLA (MIT, Marcin Sokalski), flex's `FlexLexer.h` (BSD-3-Clause,
  University of California), David M. Gay's `strtod` (Lucent Technologies) and
  Unicode conversion tables (Unicode, Inc.); and Analysis Situs 2026.1.1's
  asiAlgo, which finds fillets and drilled holes and takes fillets off
  (BSD-3-Clause; Sergey Slyadnev, OPEN CASCADE SAS, Quaoar Studio LLC, Julia
  Slyadneva), two of its files under OCCT's LGPL-2.1 with the Open CASCADE
  exception;
- `workspace/solver/planegcs.wasm`: FreeCAD's PlaneGCS sketch solver
  (LGPL-2.0-or-later) through the Salusoft89 `planegcs` wrapper
  (LGPL-2.1-or-later), with Eigen 3.4.0 (MPL-2.0) and Boost 1.86 headers
  (BSL-1.0);
- in both modules: the Emscripten runtime (MIT or UIUC/NCSA), LLVM's libc++,
  libc++abi, libunwind and compiler-rt (Apache-2.0 WITH LLVM-exception) and
  musl (MIT);
- bundled in `workspace/app.js` and the picking worker: three.js 0.186.1 and
  three-mesh-bvh 0.9.15 (MIT).

Their licence texts and notices are in the plugin's `LICENSES/`
(`LICENSES/README.md` lists each one). The corresponding sources are pinned to
exact upstream commits, with our patches and the scripts that rebuild both
modules, in `kernel-build/` and `solver-build/` (Analysis Situs: the 169 files
the kernel compiles, as published, in `kernel-build/asi/`); `LICENSES/README.md`
also says how to rebuild the plugin with a changed OCCT, Analysis Situs or
PlaneGCS. Analysis Situs' licence and copyright lines:
`LICENSES/AnalysisSitus-BSD-3-Clause.txt`.

## The Assistant's provider packages

The Assistant reaches the cloud model providers a user chooses, and local
servers that answer in the same format, through the providers' official
JavaScript packages. They are pinned in `magnusim-web/package.json` and
`package-lock.json`, and `npm ci` installs them into
`magnusim-web/node_modules`; none is shipped in the repository:

- `@anthropic-ai/sdk` 0.131.0 (MIT), with `standardwebhooks` 1.1.1 (MIT),
  `@stablelib/base64` 1.0.1 (MIT), `fast-sha256` 1.3.0 (Unlicense),
  `json-schema-to-ts` 3.1.1 (MIT), `ts-algebra` 2.0.0 (MIT) and
  `@babel/runtime` 7.29.7 (MIT, which vtk.js uses too);
- `openai` 7.27.0 (Apache-2.0), which has no dependencies.

These licenses are compatible with Magnusim's GPL-3.0-or-later license. Each
package's license text is in its folder under `node_modules`, except
`standardwebhooks`, whose `package.json` declares MIT and which ships no license
file.

## The Assistant's tool-connection package (MCP)

Other apps on this PC and coding agents reach Magnusim's tools through the Model
Context Protocol (MCP). Magnusim serves it with the official MCP TypeScript SDK's
server package, pinned in `magnusim-web/package.json` and `package-lock.json` and
installed by `npm ci` into `magnusim-web/node_modules`; none
is shipped in the repository:

- `@modelcontextprotocol/server` 2.3.0 (Apache-2.0), with
  `@modelcontextprotocol/core` 2.3.0 (Apache-2.0) and `zod` 4.6.7 (MIT).

These licenses are compatible with Magnusim's GPL-3.0-or-later license. Each
package's license text is in its folder under `node_modules`.

## The Assistant's coding agents

The Assistant can work through a coding agent the user has installed and signed
in to on their own (Settings → Assistant lists the ones Magnusim knows). Those
agents are separate programs under their own licenses and terms: Magnusim never
ships one, never depends on one, and starts only what the user installed.

`npm run typecheck` checks Magnusim CAD's side of the Agent Client Protocol
against the protocol's own types with `@agentclientprotocol/sdk` 1.7.0
(Apache-2.0), a development dependency the app never runs.

`splitCommand()` in `magnusim-web/scripts/server/assistant/agents/acp.ts`, which
splits a custom agent's command into its program and arguments without a command
shell, is ported from SolidCraft's agent chat
(<https://github.com/bherbruck/solidcraft>,
`crates/ui-egui/src/agent_chat/acp.rs`, `split_command`) under the MIT License:

> Copyright (c) 2026 SolidCraft contributors
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

The MIT License is compatible with Magnusim's GPL-3.0-or-later license. Other
parts of the coding-agent support (its search folders, process stop order and
protocol handling) follow SolidCraft's design, as their module headers say; that
code is Magnusim's own.

## Other dependencies

The JavaScript dependency inventory is recorded in the lockfiles:
`magnusim-web/package-lock.json` (the page, the server and the Assistant),
`magnusim-web/bundled-plugins/cad/package-lock.json` (the CAD workspace) and
`magnusim-web/desktop/package-lock.json` (Electron and the installer build).
`npm ci` installs them into `node_modules`; none is shipped in the repository.
React, vtk.js and the other packages keep their upstream licences.

The installer ships the npm packages the app runs, and the CAD workspace's
bundled libraries, with their licence texts in `THIRD_PARTY_NOTICES.txt` next to
the app; `magnusim-web/desktop/scripts/notices.mjs` writes it from the lockfiles
at each build, and the build fails on a package without a licence it accepts.
Electron's and Chromium's licences are next to `Magnusim CAD.exe`.

## Colour maps

The results colour maps in `magnusim-web/src/plugin-ui/colormaps/` are data
tables from viridis (mpl-colormaps, Nathaniel Smith and Stefan van der Walt,
CC0 1.0) and cmocean balance and curl (Kristen M. Thyng, MIT). Their license
texts are in that folder's `LICENSES/`.
