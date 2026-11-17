# Dhanya Sukanth B.K. — Portfolio

Personal portfolio for **Dhanya Sukanth B.K.**, Senior Cloud Engineer at Microland (Bengaluru, India).

## Stack

- Plain HTML, CSS and JavaScript. No frameworks, no build step, no npm dependencies.
- Everything is served from this site's own origin: fonts, images, scripts and styles. The page makes **zero third-party requests**, sets no cookies and stores nothing in the browser.
- Fonts are self-hosted variable WOFF2 files (Sora, Manrope, JetBrains Mono), all under the SIL Open Font License 1.1. Licence texts are in `assets/fonts/`.

## Structure

```
index.html                 page markup
404.html                   not-found page (uses root-relative paths, so it needs the custom domain)
assets/css/style.css       all styles (rem-based on a fluid root: scales from 320px to 4K)
assets/css/noscript.css    loaded only when JavaScript is disabled
assets/js/main.js          loader, navigation, theme, animations, hero canvas
assets/js/chatbot.js       offline rule-based assistant
assets/fonts/              self-hosted fonts + licences
assets/images/             WebP images
_headers                   security headers (read by Cloudflare Pages)
.well-known/security.txt   security contact (RFC 9116). Renew the Expires date yearly.
.nojekyll                  tells GitHub Pages to publish dot-folders such as .well-known
```

## Run locally

```
python -m http.server 8765
```

Then open http://127.0.0.1:8765/.

## Security model

| Layer | What is in place |
|---|---|
| Content Security Policy | `default-src 'none'` with only same-origin scripts, styles, fonts and images. No `unsafe-inline`, no `unsafe-eval`, no wildcards. Set in a `<meta>` tag so it applies on any host, and repeated in `_headers`. |
| Code | No inline scripts, inline styles or inline event handlers. Visitor input in the chatbot is written with `textContent` only. All new-tab links use `rel="noopener noreferrer"`. |
| Supply chain | No CDNs and no third-party JavaScript, so nothing external can be tampered with. |
| Transport | HTTPS only (enable the settings below). |

### Going live on a custom domain

These steps are done in the GitHub and Cloudflare dashboards, not in this repository:

1. **GitHub**: Settings → Pages → Custom domain. Enter the domain (this creates a `CNAME` file) and tick **Enforce HTTPS**. Also verify the domain under your account's Settings → Pages → *Verified domains* so nobody else can claim it.
2. **Cloudflare DNS**: point the apex at GitHub Pages' four A records (185.199.108.153, .109.153, .110.153, .111.153) and `www` as a CNAME to `<username>.github.io`. Do not leave unused DNS records pointing at GitHub: dangling records are how subdomain takeovers happen.
3. **Cloudflare SSL/TLS**: mode **Full (strict)**, **Always Use HTTPS** on, minimum TLS **1.2**, TLS 1.3 on, then enable **HSTS** once HTTPS is confirmed working. Turn on **DNSSEC**.
4. **Security headers**: GitHub Pages cannot send custom headers. Either
   - host on **Cloudflare Pages** (connect this repo; `_headers` is applied automatically), or
   - keep GitHub Pages and add a Cloudflare **Rules → Transform Rules → Modify Response Header** rule that sets the headers listed in `_headers`.
5. Check the result at https://securityheaders.com and https://www.ssllabs.com/ssltest/.
6. After the domain is live, add `<link rel="canonical">`, `og:url` and an `og:image` to `index.html`, plus a `sitemap.xml`.

## Contact

- LinkedIn: [Dhanya Sukanth B.K.](https://www.linkedin.com/in/dhanya-sukanth-b-k)
- GitHub: [dhanyasukanth](https://github.com/dhanyasukanth)
