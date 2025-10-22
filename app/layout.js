
import ClientProvider from "./components/ClientProvider/page";
import ConditionalLayout from "./ConditionalLayout";

import "./globals.scss";

export const metadata = {
  title: "T-Shirt Store",
  description: "Find your perfect custom T-shirt.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Acme&family=Unbounded&family=Anton&family=Rubik:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProvider>
          <ConditionalLayout>
            <main>{children}</main>
          </ConditionalLayout>
        </ClientProvider>
      </body>
    </html>
  );
}
