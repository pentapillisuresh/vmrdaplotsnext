
import BlogDetail from '@/pages/BlogDetail';

export default async function Page({ params }) {
  const { id } = await params;

  return <BlogDetail id={id} />;
}
