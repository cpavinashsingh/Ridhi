const Home = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
      <section className="w-full text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="romantic-title text-7xl font-bold leading-[1.1] tracking-tight text-rose-50 sm:text-8xl">
            Hi Ridhi ✨
          </h1>
          <div className="mt-10 space-y-5">
            <p className="text-2xl font-semibold text-rose-100">This little corner of the internet is only yours.</p>
            <p className="text-lg leading-relaxed text-rose-100/85">
              Every message here is a warm hug,
              <br />
              every word is written with love,
              <br />
              and every moment feels brighter with you.
            </p>
            <p className="pt-2 text-xl font-semibold text-pink-300">You are my favorite notification, always. 💖</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
