This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication environment variables

Add these variables in **Vercel → Project → Settings → Environment Variables**, then redeploy:

- `AUTH_SECRET`: a unique random secret for Production (do not reuse the local value). Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
- `AUTH_TRUST_HOST`: `true`.
- `AUTH_URL`: `https://e-commerce-five-pink-80.vercel.app` for the Production environment.
- `ROUTE_API_BASE_URL`: `https://ecommerce.routemisr.com/api`.

`AUTH_SECRET` must be present in the Vercel environment used by the deployment. Without it, Auth.js returns its generic server configuration error at `/api/auth/error`. Keep secrets out of source control and do not prefix them with `NEXT_PUBLIC_`.
