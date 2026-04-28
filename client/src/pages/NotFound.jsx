import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-black text-white">Page not found</h1>
        <p className="mt-3 text-slate-400">The route you are looking for does not exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
          Back to home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
