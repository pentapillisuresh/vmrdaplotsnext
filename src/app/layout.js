import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/providers/Providers";
import WhatsAppButton from "@/components/WhatsAppButton";
import "leaflet/dist/leaflet.css";
import Script from "next/script";

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

          <WhatsAppButton />
        </Providers>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X4LGT3FVSJ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-X4LGT3FVSJ');
          `}
        </Script>
      </body>
    </html>
  );
}