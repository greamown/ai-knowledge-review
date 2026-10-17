# AI Knowledge Review

Three bilingual (Traditional Chinese / English) AI interview review sites in one place. The landing page lets you pick a topic; each topic keeps its own study, quiz, and review flow.

**[Open the website](https://greamown.github.io/ai-knowledge-review/)**

| Topic | Path | Content |
| --- | --- | --- |
| Agent Knowledge Lab | [`agent/`](agent/) | 12 topics on AI agents: architecture, tool calling, context engineering, memory & RAG, multi-agent, security, evaluation, system design. Study Q&A plus a 15-question quiz. |
| GenAI Knowledge | [`genai/`](genai/) | 97 scenario-based notes and 34 quiz questions across model architecture, fine-tuning, RAG & agents, inference & deployment. |
| VLA Knowledge Lab | [`vla/`](vla/) | 30 questions on Vision-Language-Action for robotics and Physical AI, with concept diagrams, practice sessions, and a mistake review list. |

No build step, package install, or backend. Everything is static and served from GitHub Pages.

## Project structure

```text
.
├── index.html                # Landing page: choose a topic
├── shared/
│   ├── progress-records.js   # Per-item progress records with timestamps and the merge used by sync
│   ├── cloud-sync.js         # Google sign-in + Firestore sync, used by all three topics
│   └── firebase-config.js    # Public Firebase Web App configuration
├── agent/                    # Agent Knowledge Lab (index, learn, quiz pages)
├── genai/                    # GenAI Knowledge (single page; content lives in script#seed)
├── vla/                      # VLA Knowledge Lab (single page app)
├── tests/                    # Shared progress-record and cloud-sync checks
├── firestore.rules           # Per-user private backup access rules
└── .github/workflows/pages.yml
```

Each topic loads `shared/progress-records.js` and starts sync with one call:

```html
<script type="module">
  import { startCloudSync } from "../shared/cloud-sync.js";
  startCloudSync({ progress: agentProgress, field: "agentRecords", legacyField: "agentKnowledge", legacyTimeField: "agentKnowledgeUpdatedAt" });
</script>
```

The topic exposes `progress` (`records()`, `apply(records)`, `fromLegacy(snapshot, at)`), calls `markProgressDirty()` after saving, and provides `#firebaseStatus`, `#firebaseLogin`, `#firebaseSync`, `#firebaseLogout` (optional: `#cloudAccount`, `#cloudLocalTime`, `#cloudRemoteTime`). Status text follows `<html lang>`.

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

Runs the shared sync and record checks plus each topic's content and behavior checks (Node.js 22+). The Agent browser smoke test (`agent/tests/browser.cjs`) needs Playwright; run it with `BASE_URL=http://127.0.0.1:8000/agent`.

## Content maintenance

- **Agent:** Chinese answers live in `agent/learn.html`, English in `agent/learn-content.js`; quiz bank in `agent/questions.js`.
- **GenAI:** notes and quiz in `script#seed` inside `genai/index.html`; Chinese in the original fields, English in each item's `en` object.
- **VLA:** keep `vla/questions.js` banks aligned by index across languages and add questions to the end (IDs are array indices); notes in `vla/learning.js`.

## Deployment

Pushing to `main` deploys the site with GitHub Actions. In **Settings → Pages**, set the source to **GitHub Actions**.

## License

[Apache 2.0](LICENSE)
