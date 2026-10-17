# Voice agent — phase 2, not activated in this starter

Recommended repo to evaluate: [LiveKit Agents](https://github.com/livekit/agents) (Apache-2.0 framework) or [Pipecat](https://github.com/pipecat-ai/pipecat). They provide the voice-agent runtime, not a free phone line, legal consent, customer lists or unlimited telephony.

## Launch order

1. Start with an inbound web voice demo on a test page before using public phone numbers.
2. Add a telephony/SIP provider only after there is a paying customer and the cost is approved.
3. Use an opening disclosure such as: “Hi, I’m RelayGrid AI’s automated assistant. I can answer general questions or help record a callback request.”
4. Obtain permission before recording or transcribing if applicable, and tell users how to reach a human.
5. For outbound calls, restrict to callbacks the recipient explicitly requested or another specifically reviewed lawful scenario. Do not implement unsolicited bulk AI calling.
6. Provide opt-out, suppression lists, frequency controls, auditable call outcomes and a human fallback.
7. Review rules for the caller's and recipient's jurisdictions. For Indian commercial communications, consult current TRAI sender guidance and counsel; do not assume that having a phone number means marketing consent.

## Example tool policy

- Allowed: answer approved FAQs, collect a request for a callback with consent, create a lead/task, summarize call outcome.
- Approval required: quote custom pricing, promise delivery dates, issue credits, contract commitments, account changes, delete records, send any follow-up outside a pre-approved and consented workflow.
- Not allowed: claim to be human, mislead callers about AI, fabricate testimonials, hide recording, continue after opt-out, or invent that an action succeeded.

Production requires current provider documentation, secrets, cost limits, consent/legal review and real-call testing. It is intentionally not activated by the static-site deployment.
