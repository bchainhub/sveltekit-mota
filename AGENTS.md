# AGENTS.md — Project Constitution for AI Agents

This file is the single authoritative instruction set for all AI agents
working in this repository, regardless of tooling.

All reasoning, planning, and implementation must follow this document.

---

## Source of Truth

This file is the primary constitution.

If a secondary constitution exists (e.g. `constitution.md`), it is subordinate
to this file unless explicitly stated.

If there is any conflict between instructions, the order of precedence is:

1. AGENTS.md
2. constitution.md (if present)
3. spec/ documents (if present)
4. Codebase conventions
5. Everything else

---

## Core Principles (Non-Negotiable)

- SvelteKit-first. No custom servers or other web frameworks.
- File-based routing under `src/routes` only.
- TypeScript everywhere. Avoid `any` unless justified.
- Simplicity and local reasoning over abstraction.
- Security fixes always override convenience.
- Vulnerable solutions must be replaced.
- Create separate helper functions in `helpers` directory instead of adding themto the main file.

---

## Spec / Planning Workflow

This project supports spec-driven development.

### If spec-kit is present

Use the standard flow:

1. `speckit.specify`
2. `speckit.plan`
3. `speckit.tasks`
4. `speckit.implement`

### If spec-kit is NOT present

Follow the same flow manually:

1. Write a short spec (goals, constraints, acceptance criteria)
2. Write an implementation plan
3. Break into tasks
4. Implement against the plan

Trivial changes may skip formal specs.

---

## Dependency Update Policy

This project tracks latest stable versions.

- Use `ncu -i` (interactive) to update dependencies.
- Review changes manually.
- Prefer latest stable releases.
- Breaking upgrades must:
  - document impact
  - include migration changes
  - update tests

---

## Technology Constraints

### Frontend

- SvelteKit
- Tailwind CSS
- Lucide icons
- No component libraries unless explicitly approved

### Backend

- SvelteKit server routes
- Native Web APIs
- Supabase (or other SQL-compatible providers)
- No separate backend services unless necessary

### State

- `svelte/store`
- No Redux/Zustand/MobX

### Internationalization (Optional)

Translations are supported using `typesafe-i18n`.

If translations are used:

- Use `typesafe-i18n` as the only i18n solution.
- Do not introduce alternative i18n frameworks.

Recommended scripts:

- `"typesafe-i18n": "typesafe-i18n"`
- `"i18n:extract": "typesafe-i18n --no-watch"`
- `"i18n:watch": "typesafe-i18n"`

During active development of translations, run:

- `i18n:watch`

---

## Full-stack Libraries (Domain Stack)

These libraries define core domain behavior and should be treated as
first-class primitives, not replaceable utilities:

- blockchain-wallet-validator
- country-codes-and-flags
- device-sherlock
- exchange-rounding
- payto-rl
- txms.js
- ican.js (@blockchainhub/ican)
- typesafe-i18n
- vite-plugin-pwa

---

## Domain Protocols and Concepts

These are foundational concepts for this project.
Agents must respect their semantics and not invent alternatives.

---

### ICAN (International Crypto Account Number)

ICAN is an IBAN-like addressing standard for crypto identities.

- Format: country/network prefix + checksum + BBAN
- Example network prefix: `cb` (Core Blockchain)
- Checksum is calculated using IBAN-style algorithm
- Used for identity, wallet addressing, and routing

Specification:

- https://payto.onl/solutions/ican

Reference implementation:

- ican.js (`@blockchainhub/ican`)

Agents must:

- treat ICAN addresses as canonical identity format
- validate using proper checksum algorithms
- never assume fixed checksum values

---

### Payto Protocol

Payto is a universal payment routing scheme extended from RFC 8905.

It defines how payments, identities, and metadata are encoded in URLs.

Specification:

- https://payto.onl/solutions/payto
- https://payto.money/
- https://github.com/core-laboratories/payto/blob/master/docs/scheme.md

Agents must:

- use Payto URLs for payment routing when applicable
- not invent proprietary payment schemes
- preserve compatibility with Payto spec

---

### Fintag

Fintag is a human-friendly alias and metadata discovery mechanism
for financial identities.

Fintag discovery can be published via:

- HTML meta tags, or
- a `.well-known` endpoint on the domain

References:

- https://payto.money/
- https://payto.onl/solutions/fintag

Agents must:

- treat fintags as resolvable identifiers
- not treat them as raw wallet addresses
- support both discovery methods when integrating

---

### TxMS (Transaction Message System)

TxMS is a Transaction Message System (similar to SMS/MMS),
allowing transactions to be sent as messages.

Specification:

- https://payto.onl/solutions/txms

Network numbers for Core Blockchain:

- Mainnet: +12019715152
- Testnet (Devín): +12014835939

Agents must:

- model message-based transaction transport using TxMS semantics
- never rename TxMS as "Transaction Management System"
- keep mainnet/testnet routing explicit

---

### PayPass

PayPass is a payment identifier packaged as a mobile wallet pass.

- Apple Wallet: `.pkpass`
- Google Wallet: wallet object / save link

Specification:

- https://payto.onl/solutions/paypass

Agents must:

- treat PayPass as a wallet-storable payment identifier
- maintain compatibility with Apple/Google wallet formats
- never downgrade wallet security checks

---

### ORIC (Organization Identification Code)

ORIC is an organization identifier conceptually similar to a BIC code.

Specification:

- https://payto.onl/solutions/oric

API:

- https://oric.payto.onl/
- https://www.postman.com/core-labs/oric/collection/ahg6zt9/oric-api-service

Agents must:

- treat ORIC as an organization identifier
- integrate using official endpoints
- not hardcode assumptions about organization data

---

## Authentication and Identity

### Passkey / WebAuthn

User authentication may use:

- Passkey (WebAuthn)
- CorePass connector (identity wallet, similar to MetaMask model)

Reference client:

- https://corepass.net/

CorePass includes Passkey support and acts as a cryptographic identity wallet.

---

### CorePass Enriched Identity

During registration, CorePass may provide user-enriched data
if the user explicitly consents:

Possible fields:

- email (string, unverified)
- o18y (boolean)
- o21y (boolean)
- kyc (boolean)
- kycDoc (string)
- dataExp (number, minutes)

These data are:

- provided only once (during enrichment)
- signed by the user’s CoreID (Ed448)
- trusted only if signature is valid

---

### Data Expiration Model

CorePass allows users to define an expiration duration (`dataExp` in minutes)
for enriched data.

Server computes:

- `provided_till = now + (dataExp * 60)`

Agents must:

- enforce expiration strictly
- never extend expiration without new user signature
- treat expired data as non-existent

---

### Enrichment Endpoint

Enriched data are sent to:

- `POST /passkey/data`

With:

Payload:

- `{ coreId, credentialId, timestamp, userData }`

Headers:

- `X-Signature: <Ed448 signature>`

Rules:

- `coreId` must be valid mainnet ICAN address
- timestamp must be within 10 minutes
- signature must verify over canonical JSON
- public key derived from CoreID BBAN
- no database lookup for key material

Agents must:

- validate signature before trusting any field
- reject enrichment if any invariant fails
- remove pending registrations on failure

---

## Exchange Rates and Payments

### Exchange Rates

Use CorePort:

- https://coreport.net/
- https://www.postman.com/core-labs/coreport/overview

Do not embed custom FX logic if CorePort is available.

---

### On/Off-Ramp and Payments

For fiat/crypto on-ramp, off-ramp, payments, donations,
and boosters, use CorePort:

- https://coreport.net/

Avoid introducing ad-hoc payment providers.

---

## Database

The installed database provider must be inferred from
project configuration (e.g. `package.json`, env, deployment config).

Possible providers include:

- Cloudflare D1
- Supabase
- Other SQL-compatible systems

Agents must:

- avoid provider-specific assumptions
- keep schemas portable
- read project config before designing persistence
- modify `schema.sql` to match the project's needs

---

## Formatting and Indentation

Follow `.editorconfig` if present.

If `.editorconfig` is not present or ambiguous:

- Use tabs for indentation.
- Tab width = 4 spaces (logical width).
- Do not convert tabs to spaces.
- Do not mix tabs and spaces.
- Do not add trailing whitespace (spaces or tabs at end of lines).
- Files must end with exactly one newline.
- Do not add additional trailing empty lines.

Reformat the file to match the above rules if necessary.

---

## Quality Gates

- Tests for core logic and critical flows.
- Functions should be small and single-purpose.
- Side effects must be explicit.
- Prefer pure functions.
- Tests are preferrable for new features.

---

## Change Control

Any change to AGENTS.md must:

- justify tradeoffs
- include migration guidance if breaking
- be treated as a governance change
