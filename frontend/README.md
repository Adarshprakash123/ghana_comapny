# Ghana Company

This is a Next.js project.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run start
```

## Image uploads on production

If admin image uploads fail with `413 Request Entity Too Large`, your reverse proxy (usually Nginx) is blocking the request before it reaches Next.js. The local dev server does not apply the same limit, which is why uploads can work locally but fail on production.

Add or increase the body size limit in your Nginx site config:

```nginx
client_max_body_size 20M;
```

Then reload Nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

The admin uploader also compresses large images in the browser before upload, but the server limit still needs to be high enough for the compressed file size.

## Push to GitHub

This repository is configured to ignore generated files like `node_modules` and `.next`, so only source files and project configuration should be committed.
