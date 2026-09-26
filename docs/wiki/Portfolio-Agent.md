# Portfolio Agent ("Ask Jawad")

A floating chat, defined in `Agent.dc.html` and imported into every page, that answers visitor questions in Jawad's voice.

## Behaviour

| Capability | How |
| --- | --- |
| **Chat** | Sends the conversation to `POST /api/agent` and renders the plain-text reply |
| **Navigation** | Phrases like "go to projects", "take me to experience" or `/go contact` scroll to the matching section client-side, with no API call |
| **Quick prompts** | Chips such as *AI fallback design* submit preset questions |
| **Voice input** | `SpeechRecognition` / `webkitSpeechRecognition`. The mic button only appears where supported |
| **Read-aloud** | `speechSynthesis` at rate 1.02, toggleable. It stops when the panel closes |
| **Fallback answers** | A regex → answer table in `Agent.dc.html` covers greetings, stack, AI resilience, experience, projects and contact. It's used when the API is unavailable |

## Server prompt

The persona and facts live in `SYSTEM_PROMPT` in [`api/_agent.js`](../../api/_agent.js). The key rules:

- Speak in the first person as Jawad's agent, but **admit to being an AI** if sincerely asked.
- Only state facts from the list. If something isn't there (salary, private client names), say so and point to Gravatar.
- **Never share an email, phone number or WhatsApp.** Gravatar is the only contact channel.
- Plain text, no markdown, usually under 150 words.
- Stay on topic and politely decline unrelated requests.

### Updating facts

1. Edit the `Facts you can rely on` list in `SYSTEM_PROMPT`.
2. Update the matching fallback answers in `Agent.dc.html` so both paths agree.
3. Update `Portfolio.dc.html` if the fact is shown on the page.
4. Keep claims consistent across all three. The agent should never contradict the page.

## Model & parameters

| Setting | Value | Where |
| --- | --- | --- |
| Model | `claude-opus-5` | `MODEL` |
| Max output | 1024 tokens | `max_tokens` |
| Effort | `low` | `output_config.effort` |
| Prompt caching | system prompt, `ephemeral` | `cache_control` |
| Refusal handling | Server-side fallback beta, plus a friendly canned reply on `stop_reason: refusal` | `betas`, `fallbacks` |

To change the model, edit `MODEL` and check the [Anthropic models overview](https://docs.anthropic.com/en/docs/about-claude/models) for current IDs.

## Cost controls

- 30 requests per IP per 10 minutes (per instance)
- At most 20 messages per request, and 2,000 characters per message
- Short replies (`max_tokens: 1024`, low effort)
- Cached system prompt
- **Recommended:** set a monthly spend limit in the Anthropic Console
