import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_component/navbar/Navbar";
import { PreferencesProvider } from "./_component/preferences/Preferences";
import Footer from "./_component/footer/Footer";
import { AuthProvider } from "./_component/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "FreshCart | Fresh products delivered to your door",
  description: "Shop quality products across groceries, fashion, beauty, home and electronics with FreshCart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{var l=localStorage.getItem('freshcart-locale');var t=localStorage.getItem('freshcart-theme');if(l==='ar'||l==='en'){document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}" }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <PreferencesProvider>
            <Toaster>
              <Navbar />
              {children}
              <Footer />
            </Toaster>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
