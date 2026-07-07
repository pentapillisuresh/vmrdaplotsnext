import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/providers/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="fNAJTMSC3OvV7j6z8JW-cly6JUn6fwBvZI91cOPFwbQ"
        />
      </head>
      <body className="overflow-x-hidden">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}