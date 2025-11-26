# sbd-nextjs-myaccount

The **MyAccount** module is the central user dashboard for managing personal settings, security, and profile information within the Second Brain ecosystem.

## Features

-   **Profile Management**: Update personal details, avatar, and banner.
-   **Security Settings**: Manage password, 2FA, and active sessions.
-   **Subscription Management**: View and manage subscription plans.
-   **Activity Log**: Track recent account activity.
-   **Notifications**: Configure notification preferences.

## Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Forms**: React Hook Form + Zod
-   **UI Components**: Radix UI, Lucide React
-   **Testing**: Jest, Playwright

## Prerequisites

-   Node.js 20+
-   pnpm (recommended) or npm/yarn

## Getting Started

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Set up environment variables**:
    Copy `.env.example` to `.env.local` and configure the necessary variables.
    ```bash
    cp .env.example .env.local
    ```

3.  **Run the development server**:
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is configured for static export and deploys to GitHub Pages.

### GitHub Pages Deployment

The CI/CD pipeline automatically builds and deploys the static site to GitHub Pages on pushes to the `master` branch.

- **Live URL**: https://rohanbatrain.github.io/sbd-nextjs-myaccount
- **Build Command**: `npm run build` (generates static files in `./out`)
- **Deployment**: Automated via GitHub Actions

### Manual Deployment

1. Build the static files:
   ```bash
   npm run build
   ```

2. Deploy the `./out` directory to your hosting provider.

### Environment Variables

For production, ensure the following environment variables are set:
- `NEXT_PUBLIC_API_URL`: API endpoint URL

## CI/CD Pipeline

The pipeline includes:
- **Testing**: Unit tests with Jest and coverage reporting
- **Linting**: ESLint code quality checks
- **Building**: Static export build
- **Security**: Dependency audit and CodeQL analysis
- **Deployment**: Automated GitHub Pages deployment
- **Releases**: Tagged releases with build artifacts
