# Project skills workspace

Add a skill only for a specific reusable workflow or specialized capability. Project-wide rules belong in the root `AGENTS.md`.

```text
skills/
└── <skill-name>/
    ├── SKILL.md
    ├── references/   # optional
    ├── scripts/      # optional
    └── assets/       # optional
```

Each skill lives in its own directory and has a `SKILL.md` with valid metadata required by the skill system. Add supporting material only when needed. Do not duplicate the complete project rules in a skill.

## Installed skills

| Skill | Source revision | Purpose |
| --- | --- | --- |
| `web-design-guidelines` | [vercel-labs/agent-skills@063bee9](https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines) | Review interface code against the current Web Interface Guidelines. |
| `shadcn` | [shadcn-ui/ui@98a1fe6](https://github.com/shadcn-ui/ui/tree/98a1fe67b439324ddc857f47fbdce056600a4329/skills/shadcn) | Reference for shadcn/ui components and tooling when the project uses them. |
| `emil-design-eng` | [emilkowalski/skills@d16ebe6](https://github.com/emilkowalski/skills/tree/d16ebe60d09a5ba2afcb7054ede9d0a10c9f6128/skills/emil-design-eng) | UI craft and animation review guidance. |
| `codebase-memory` | Local Codex skill (`~/.codex/skills/codebase-memory`, SHA-256 `8EFE4AA10EFA92B52148CCE5840ABAC552B92E5DC3AF567E5D167A5E33624DB1`) | Structural codebase queries through the Codebase Memory knowledge graph. |

`.agents/skills` points to this directory so Codex can discover the project skills without maintaining duplicate copies. The shadcn/ui skill does not mean the component library is installed: this project has no `components.json`, and its dependency and component rules still govern future implementation.

The imported skill instructions were adapted only for this environment: the web design skill uses the available network tool instead of `WebFetch`; the shadcn skill reads project context at invocation instead of Claude-style command injection; and the Emil skill's introductory response was removed so it does not interrupt a concrete task. The original upstream files remain available at the pinned revisions above. The shadcn and Emil license files are included with their copies.

`codebase-memory` was copied unchanged. It requires the Codebase Memory MCP tools on the agent host; the skill file alone does not install that service or index this repository.
