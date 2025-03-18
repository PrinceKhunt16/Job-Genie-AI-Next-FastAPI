import "./globals.css";
import { AuthProvider } from "@/context/Auth";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata = {
  title: "Job Genie",
  description: "Get quick job!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}