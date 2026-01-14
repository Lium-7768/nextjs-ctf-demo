"use client"

import { useQuery } from "@tanstack/react-query"

async function fetchData() {
  // 示例：替换为你的实际 API 调用
  // const entries = await getEntries<{ title: string }>('blogPost')
  return { message: "Hello from React Query!" }
}

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["example"],
    queryFn: fetchData,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {(error as Error).message}</div>

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
          {data?.message}
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          ✅ shadcn/ui configured
          <br />
          ✅ React Query configured
          <br />
          ✅ Contentful configured
        </p>
      </main>
    </div>
  )
}
