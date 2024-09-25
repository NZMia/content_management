import Link from 'next/link';

export default function Home() {
  const title = 'Content Publisher';

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="mt-4 text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Seamless Content Publishing from Notion
        </h1>
        <p className="mb-8 text-xl">
          Unlock the power of your Notion content and reach a wider audience
          effortlessly.
        </p>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-yellow-200 after:via-yellow-300 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-yellow-700 before:dark:opacity-10 after:dark:from-yellow-900 after:dark:via-[#ffd700] after:dark:opacity-40 before:lg:h-[360px]">
        <h1 className="text-center text-6xl font-bold">
          {title.split('').map((char, index) => (
            <span
              key={index}
              className="animate-twist inline-block"
              style={{ '--index': index } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        <Link href="/daily-record" className="block">
          <div className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold">Feedback Hub</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Share your thoughts and suggestions on published content.
            </p>
            <button className="rounded bg-black px-4 py-2 font-bold text-white transition duration-300 dark:bg-white dark:text-black">
              Give Feedback
            </button>
          </div>
        </Link>

        <Link href="/blog" className="block">
          <div className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold">Demo Showcase</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Explore our current demo and see Content Publisher in action.
            </p>
            <button className="rounded bg-black px-4 py-2 font-bold text-white transition duration-300 dark:bg-white dark:text-black">
              View Demo
            </button>
          </div>
        </Link>

        <Link href="/contact" className="block">
          <div className="rounded-lg bg-white p-6 text-center shadow-md transition-shadow duration-300 hover:shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold">Custom Solutions</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Learn about new features and custom access control options.
            </p>
            <button className="rounded bg-black px-4 py-2 font-bold text-white transition duration-300 dark:bg-white dark:text-black">
              Contact Us
            </button>
          </div>
        </Link>
      </div>
      <div className="z-10 w-full max-w-5xl items-end justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Empower Your Content with&nbsp;
          <code className="font-mono font-bold">Content Publisher</code>
        </p>
      </div>
    </main>
  );
}
