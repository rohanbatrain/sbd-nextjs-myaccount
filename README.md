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

## Scripts

-   `pnpm dev`: Run the development server.
-   `pnpm build`: Build the application for production.
-   `pnpm start`: Start the production server.
-   `pnpm lint`: Run ESLint.
-   `pnpm test`: Run unit tests with Jest.
-   `pnpm test:e2e`: Run end-to-end tests with Playwright.
-   `pnpm storybook`: Start Storybook for component development.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Reusable UI components.
-   `lib/`: Utility functions and shared logic.
-   `store/`: Zustand state management stores.
-   `hooks/`: Custom React hooks.

## License

Private
