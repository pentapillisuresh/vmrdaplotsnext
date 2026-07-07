import PropertyDetail from "@/pages/PropertyDetail";

export default async function Page({ params }) {
  const { title } = await params;
  console.log("page title:::",title)
  return <PropertyDetail title={title} />;
}