# Cookie Consent

Turn a legal obligation into something visitors actually appreciate: a short, clear choice at the corner of the page, honest wording, and nothing loading behind their back.

The consent banner lives in **Settings → Privacy & Security → Cookie Consent**. One switch turns it on for the whole site, and Vale handles the rest — recording decisions, gating your scripts, and keeping pages cached.

::: tip WHY IT MATTERS
Visitors in the EU, the UK and a growing number of US states must be able to say no to non-essential cookies as easily as they say yes. A banner that only offers **Accept** is not a choice, and scripts that load before the answer undo the banner entirely. Vale's consent module is built around those two rules.
:::

## What visitors see

- A panel in the **bottom-right corner** (full width on phones) so it never covers the page content.
- **Accept all**, **Reject optional**, **Settings** and **Save selection** — accepting and rejecting are equally easy to reach.
- A short explanation of what is loaded, written from the services that are actually switched on.
- A small **Cookie settings** button afterwards, so anyone can change or withdraw their choice at any time.

After a decision the page reloads. That is deliberate: Vale emits only the code the visitor allowed, instead of trying to patch scripts into the page afterwards.

## Turn it on

1. Open **Settings → Privacy & Security → Cookie Consent**.
2. Tick **Enable Consent Banner**.
3. Choose the categories you want to offer (below).
4. Optionally replace the banner title and text with your own wording.
5. Save.

While the banner is off, the simple cookie notice from **General → Site → Cookies** is shown instead (if it is enabled). Its settings are hidden while the banner is on, so the two never compete.

## Categories

| Category | What it is for |
|---|---|
| **Necessary** | Always active, never shown as an option: sessions, cart, CSRF protection, your own first-party analytics. |
| **Functional** | Preferences and convenience features (for example remembering a language or layout choice). Also the category that unlocks provider captchas when spam protection fallback is enabled. |
| **Analytics** | Analytics services you added yourself. |
| **Marketing** | Advertising and remarketing tags. |

Only categories that have something assigned to them are offered. If nothing on your site needs marketing, visitors are never asked about marketing — and the banner text does not mention it either.

## Which code is gated

- **Custom header and footer scripts** (Settings → Advanced → Custom Scripts) once you assign them a consent category.
- **Advertisement code** follows the marketing category.
- **Embedded videos and pasted iframes** are never loaded until the visitor clicks them. YouTube embeds are served through `youtube-nocookie`, so even the click does not create tracking cookies.
- **Third-party comments** (Disqus, Giscus, Facebook) render a "Load comments" card instead of loading on page open. Nothing is requested from the provider until the visitor clicks.

Scripts without a category still load before consent — the Custom Scripts screen flags them, so assign a category to each one you add.

::: warning STILL YOUR CALL
- Spam protection providers (reCAPTCHA, hCaptcha, Turnstile) load their challenge script before consent unless you enable **Fallback Spam Protection to Honeypot or Math if the visitor does not consent**. With it on, provider captchas wait for the Functional category and everyone else gets a math question plus a hidden honeypot.
- Scripts injected by a plugin or your own theme code must be gated by that code; Vale can only gate what it renders.
- This screen records decisions. It does not create your privacy policy, terms or processing agreements — link them from **E-Commerce → Legal**.
:::

## Banner title and text

Both fields are translatable when **Multi-Language Content** is on: switch language tabs in the field, and each language gets its own banner text.

Leave the text empty and Vale generates it from your active integrations — "only necessary cookies" when nothing else runs, one sentence per service when something does. The panel below the field shows exactly what visitors will read.

## US privacy (CCPA / CPRA)

Enable **US Privacy Opt-Out** to add a **Do Not Sell or Share My Personal Information** link to the banner. Clicking it keeps the visitor's other choices and switches marketing off.

With the same switch on, Vale honours the browser's **Global Privacy Control** signal: a visitor sending it is treated as opted out of sale/sharing, marketing stays off even after "Accept all", and the banner says so. GPC visitors receive their own cached page variant, so nothing marketing-related leaks from a shared cache.

## Version and log

- **Consent Version** — change it whenever the wording or the categories change. Every visitor is asked again, because the old decision no longer covers the new policy.
- **Consent Log Retention (days)** — how long decisions are kept (default 365, minimum 30). Old rows are removed automatically by the scheduled cron.

The log stores the anonymous consent id from the visitor's cookie, the action (grant, update, revoke), the accepted categories, the policy version, the optional user id and the timestamp. No IP address, no user agent.

## Before you go live

- [ ] Banner enabled and the text reads correctly in every language you publish.
- [ ] Every custom script has a category assigned.
- [ ] You tested **Reject optional** on a private window and confirmed the scripts disappear.
- [ ] The Cookie settings button reopens the banner and a withdrawal removes the scripts again.
- [ ] A comment page shows the "Load comments" card first and loads the provider only after a click.
- [ ] If you sell or share data with US visitors: **US Privacy Opt-Out** is on and the banner shows the Do Not Sell link.
- [ ] Your privacy policy explains what is stored and why. The page selected under **E-Commerce → Legal → Privacy Policy Page** is linked from the banner.

::: tip SEE ALSO
- [Privacy & Security](./privacy) — IP handling, captcha keys and GDPR exports.
- [Advanced](./advanced) — custom scripts, webhooks and API tokens.
- [GDPR & Privacy](../system/gdpr) — data portability and erasure overview.
:::
