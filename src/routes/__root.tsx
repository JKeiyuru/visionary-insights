import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div
      style={{
        background: "#06060a",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: '"Inter", sans-serif',
        color: "#fff",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 96,
            fontWeight: 300,
            letterSpacing: "-0.06em",
            color: "rgba(255,255,255,0.08)",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 24,
            fontWeight: 300,
            letterSpacing: "-0.025em",
            marginBottom: 10,
          }}
        >
          Page not found.
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "11px 26px",
            borderRadius: 100,
            background: "#fff",
            color: "#000",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div
      style={{
        background: "#06060a",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: '"Inter", sans-serif',
        color: "#fff",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <h1
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 22,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          This page didn't load.
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginBottom: 28 }}>
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { router.invalidate(); reset(); }}
            style={{
              padding: "11px 22px", borderRadius: 100, border: "none",
              background: "#fff", color: "#000", fontSize: 14, fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            style={{
              padding: "11px 22px", borderRadius: 100,
              border: "0.5px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14,
            }}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "VisionPlay — AI Sports Intelligence" },
      {
        name: "description",
        content:
          "VisionPlay is an AI-powered sports intelligence platform with explainable predictions across soccer, basketball, F1, baseball, tennis and cricket.",
      },
      { name: "theme-color", content: "#06060a" },
      { property: "og:title", content: "VisionPlay — AI Sports Intelligence" },
      {
        property: "og:description",
        content: "Explainable AI predictions for the world's biggest sports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "VisionPlay — AI Sports Intelligence" },
      { name: "description", content: "VisionPlay is an AI-powered sports intelligence platform that combines predictive analytics, community forecasting, and advanced match insights." },
      { property: "og:description", content: "VisionPlay is an AI-powered sports intelligence platform that combines predictive analytics, community forecasting, and advanced match insights." },
      { name: "twitter:description", content: "VisionPlay is an AI-powered sports intelligence platform that combines predictive analytics, community forecasting, and advanced match insights." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/81217770-cfb4-444a-9e39-03e8743705a8" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/81217770-cfb4-444a-9e39-03e8743705a8" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Space+Grotesk:wght@300;400;500;600&display=swap"
        />
        <HeadContent />
      </head>
      <body style={{ margin: 0 }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(18,18,28,0.97)",
              border: "0.5px solid rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: 13,
              fontFamily: '"Inter", sans-serif',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
