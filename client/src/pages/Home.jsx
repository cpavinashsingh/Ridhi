const Home = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="romantic-title text-7xl font-bold leading-[1.1] tracking-tight text-rose-50 sm:text-8xl">
            Hi Ridhi ✨
          </h1>
          <div className="mt-8 space-y-6">
            <p className="text-2xl text-rose-100">
              This space is made entirely for you.
            </p>
            <p className="text-lg leading-relaxed text-rose-100/85">
              Where every message is special,<br />
              every conversation matters,<br />
              and you're always my priority.
            </p>
            <p className="mt-8 text-xl font-semibold text-pink-300">
              💌 Let's chat whenever you want 💌
            </p>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <a
              href="#chat"
              className="rounded-full bg-gradient-to-r from-rose-300 to-pink-300 px-8 py-3 font-semibold text-rose-950 shadow-lg shadow-rose-500/30 transition hover:shadow-rose-500/50"
            >
              Start Chatting
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
