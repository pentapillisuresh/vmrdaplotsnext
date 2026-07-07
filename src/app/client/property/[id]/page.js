import ClientPropertyDetail from "@/pages/ClientPropertyDetail";

export default function Page({ params }) {
  return <ClientPropertyDetail propertyId={params.id} />;
}