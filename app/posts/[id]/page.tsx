export const dynamic = "force-dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SinglePost } from "@/components/ui/SinglePost";

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true, name: true, image: true, role: true,
          architectProfile: { select: { specialty: true } },
        },
      },
      likes: { select: { userId: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) return notFound();

  const currentUserId = session ? (session.user as any).id : "";

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[var(--cream)]">
        <div className="bg-[var(--ink)] py-10 px-6 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--terracotta)] mb-2">Post</p>
            <h1 className="display text-4xl text-[var(--cream)]">
              {post.author.name}
            </h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-10">
          <SinglePost post={post} currentUserId={currentUserId} />
        </div>
      </main>
    </>
  );
}