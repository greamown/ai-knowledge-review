# AI Knowledge Review

Three bilingual (Traditional Chinese / English) AI interview review sites in one place. The landing page lets you pick a topic; all three share the same page design and study, quiz, and review flow.

**[Open the website](https://greamown.github.io/ai-knowledge-review/)**

| Topic | Path | Content |
| --- | --- | --- |
| Agent Knowledge Lab | [`agent/`](agent/) | 30 notes and 18 quiz questions across 12 topics on AI agents: architecture, tool calling, context engineering, memory & RAG, multi-agent, security, evaluation, system design. |
| GenAI Knowledge | [`genai/`](genai/) | 106 scenario-based notes and 48 quiz questions across model architecture, fine-tuning, RAG & agents, inference & deployment. |
| VLA Knowledge Lab | [`vla/`](vla/) | 30 notes and 30 quiz questions on Vision-Language-Action for robotics and Physical AI, across 5 chapters. |

No build step, package install, or backend. Everything is static and served from GitHub Pages.

## Project structure

```text
.
├── index.html                # Landing page: choose a topic, with this browser's progress per topic
├── shared/
│   ├── study.js / study.css  # The study, quiz, and review page shared by all three topics
│   ├── progress-records.js   # Per-item progress records with timestamps and the merge used by sync
│   ├── cloud-sync.js         # Google sign-in + Firestore sync, used by all three topics
│   └── firebase-config.js    # Public Firebase Web App configuration
├── agent/                    # Each topic: index.html (page shell + content and settings in script#seed)
├── genai/                    #   and art.svg (hero illustration, also shown on the landing page)
├── vla/
├── tests/                    # Shared progress-record and cloud-sync checks
├── firestore.rules           # Per-user private backup access rules
└── .github/workflows/pages.yml
```

Each topic page holds its content in `script#seed` as `{site, questions, quiz}`: `site` has the storage key, backup name, topic-specific copy (hero, chapter labels and descriptions), and concept-map guides. The page loads `shared/study.js` and starts sync with one call:

```html
<script type="module">
  import { startCloudSync } from "../shared/cloud-sync.js";
  startCloudSync({ progress: studyProgress, field: "agentRecords", legacyField: "agentKnowledge", legacyTimeField: "agentKnowledgeUpdatedAt" });
</script>
```

`studyProgress` provides `records()`, `apply(records)`, `fromLegacy(snapshot, at)`; the page calls `markProgressDirty()` after saving and provides `#firebaseStatus`, `#firebaseLogin`, `#firebaseSync`, `#firebaseLogout`, `#cloudLocalTime`, `#cloudRemoteTime`. Status text follows `<html lang>`.

## Run locally

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Serve from the repository root so the topics can reach `shared/`.

## Progress and cloud sync

Progress is saved in browser `localStorage`, under the same keys the original standalone sites used (`agent-learning-records`, `genai-learning-v1`, `vla-knowledge-lab-v1`). Because GitHub Pages serves every project from `greamown.github.io`, progress saved on the old sites is picked up here.

Signing in with Google syncs each topic to its own field of `users/{uid}/backups/latest` (`agentRecords`, `genaiRecords`, `vlaRecords`), so topics never overwrite one another or other apps using the same document. Sync runs on sign-in, about 1.5 seconds after each change, and when the tab is hidden or shown. Each item keeps the time it last changed; a sync keeps the newer record per item in one Firestore transaction, so progress from different devices is merged rather than overwritten. Device clocks decide which change is newer. Older whole-snapshot backups are merged in once and then removed.

The Firebase Web App values in `shared/firebase-config.js` are public client configuration, not service-account credentials. Publish [firestore.rules](firestore.rules) and make sure `greamown.github.io` is an authorized domain in Firebase Authentication.

## Checks

```sh
node --test
```

Runs the shared sync and record checks, each topic's content checks, and checks that progress saved by the older Agent and VLA pages is still counted (Node.js 22+).

## Content maintenance

All three topics use the same format in `script#seed` of their `index.html`:

- **Notes** (`questions`): `id`, `title`, `answer` (plain text; blank lines separate paragraphs), `topic` (chapter index), optional `flows` (`[{caption?, steps: [...]}]`) and `sources` (`[{title, url}]`); English in each item's `en` object.
- **Quiz** (`quiz`): `id` equals the note it practices, `prompt`, four `options`, `correct` (index), `explain`; English in `en`.
- Notes are numbered by position. Never change or reuse an `id`: saved progress is keyed by it. Agent notes keep a `legacyKey` so progress from the older pages still counts; VLA ids start at 0 for the same reason.

## Deployment

Pushing to `main` deploys the site with GitHub Actions. In **Settings → Pages**, set the source to **GitHub Actions**.

## License

[Apache 2.0](LICENSE)
