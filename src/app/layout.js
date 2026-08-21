import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/providers/Providers";
import WhatsAppButton from "@/components/WhatsAppButton";
import CallButton from "@/components/CallButton";
import "leaflet/dist/leaflet.css";
import Script from "next/script";

export const metadata = {
  title: "VMRDA Approved Plots in Vizag | Buy Plots in Visakhapatnam",
  description:
    "Explore VMRDA approved plots in Vizag and buy plots in Visakhapatnam at prime locations.",
};

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

          {/* Fixed Button Container - WhatsApp on top, Call below */}
          <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-3">
            <WhatsAppButton />
            <CallButton />
          </div>
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