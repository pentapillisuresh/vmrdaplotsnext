import AreaDetail from "@/pages/AreaDetail";

export default function Page({ params }) {
  return <AreaDetail areaName={params.areaName} />;
}