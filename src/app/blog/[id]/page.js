import BlogDetail from "@/pages/BlogDetail";

export default function Page({ params }) {
  return <BlogDetail id={params.id} />;
}