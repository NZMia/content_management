import React from 'react';

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
          Hi, I'm <span className="text-gray-700 dark:text-gray-300">Mia</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700 dark:text-gray-300">
          A passionate full-stack developer crafting innovative digital
          experiences with cutting-edge technologies.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <a href="#projects" className="btn-primary">
            View Projects
          </a>
          <a href="#contact" className="btn-secondary">
            Contact Me
          </a>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Let's build something great together
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          With a passion for clean code and user-centric design, I bring ideas
          to life through innovative web solutions. My expertise spans across
          front-end and back-end technologies, ensuring seamless and efficient
          development processes.
        </p>
        <a href="#about" className="text-black hover:underline dark:text-white">
          Learn more about my journey
        </a>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          Tech Stack
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Here are the core technologies I work with:
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            'React',
            'Next.js',
            'TypeScript',
            'Tailwind CSS',
            'Node.js',
            'GraphQL',
          ].map((tech) => (
            <div
              key={tech}
              className="flex items-center justify-center rounded-md border border-black p-4 dark:border-white"
            >
              <span className="text-lg font-medium text-black dark:text-white">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
