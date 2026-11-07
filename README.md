# Lumina

> A fast, minimal AI chat app. Gemini on the back, a clean React interface on the front.

![React](https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

Lumina streams Google Gemini responses in real time and renders them as clean markdown. No clutter, no sign-up screens, just a conversation.

---

## At a glance

| | |
|---|---|
| **What it is** | A Gemini-powered chatbot web app |
| **Responses** | Streamed token by token |
| **Formatting** | Markdown with GitHub-flavored extensions (tables, task lists, code) |
| **Stack** | React 19 · TypeScript · Vite 6 · Tailwind CSS 4 |
| **AI SDK** | `@google/genai` |
| **Runs on** | Node.js 18+ |

---

## Quickstart

Three commands and you're chatting.

```bash
git clone https://github.com/sangmeshwar2006/lumina-ai-chatbot.git && cd lumina-ai-chatbot
npm install
cp .env.example .env     # then add your GEMINI_API_KEY
npm run dev
```

Open <http://localhost:3000>.

> [!TIP]
> Don't have a key yet? Create one for free at [Google AI Studio](https://aistudio.google.com/apikey).

---

## Configuration

Create a `.env` file in the project root:

```env
GEMINI_API_KEY="your_key_here"
APP_URL="http://localhost:3000"   # optional, used when deployed
```

| Variable | Required | Purpose |
|---|:---:|---|
| `GEMINI_API_KEY` | Yes | Authenticates requests to the Gemini API |
| `APP_URL` | No | Public URL of the deployed app |

> [!WARNING]
> `vite.config.ts` injects `GEMINI_API_KEY` into the client bundle. Fine for local use, but on a public deployment anyone can read the key from the browser. Proxy requests through a backend before going live.

---

## Commands

```text
npm run dev        start dev server on :3000
npm run build      production build  ->  dist/
npm run preview    serve the production build locally
npm run lint       type-check with tsc
npm run clean      remove dist/
```

---

## Under the hood

```text
 you type a message
        │
        ▼
   React UI  ──────────►  Gemini API (@google/genai)
        ▲                         │
        │      streamed chunks    │
        └─────────────────────────┘
        │
        ▼
 react-markdown + remark-gfm
        │
        ▼
   formatted reply on screen
```

**Libraries used**

- `react`, `react-dom` for the interface
- `@google/genai` to talk to Gemini
- `react-markdown`, `remark-gfm` to render replies
- `tailwindcss`, `tailwind-merge`, `clsx` for styling
- `motion` for animation, `lucide-react` for icons
- `express` available for a backend or proxy

The `@` import alias resolves to the project root.

---

## FAQ

<details>
<summary><strong>Which model does Lumina use?</strong></summary>
<br>
Whichever Gemini model is configured in the source. Check the chat service code in <code>src/</code> to change it.
</details>

<details>
<summary><strong>Is my chat stored anywhere?</strong></summary>
<br>
Messages are sent to the Gemini API to generate replies. This README does not describe any built-in persistence; review the source to see what, if anything, is saved locally.
</details>

<details>
<summary><strong>Can I deploy it?</strong></summary>
<br>
Yes. <code>npm run build</code> outputs static files to <code>dist/</code>. Read the security warning above first.
</details>

<details>
<summary><strong>The page loads but replies fail.</strong></summary>
<br>
Check that <code>.env</code> exists, <code>GEMINI_API_KEY</code> is set, and you restarted <code>npm run dev</code> after editing it.
</details>

---

## Roadmap

- [x] Streaming responses
- [x] Markdown rendering
- [ ] Saved conversations
- [ ] Theme toggle
- [ ] File and image input
- [ ] Backend proxy for the API key

---

## Contributing

Issues and pull requests are welcome.

1. Fork and create a branch
2. Make your change and run `npm run lint`
3. Open a pull request with a short description

---

## License

MIT © 2026 Sangmeshwar

<details>
<summary>Full license text</summary>

```text
MIT License

Copyright (c) 2026 Sangmeshwar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</details>

---

Built by [Sangmeshwar](https://github.com/sangmeshwar2006)
