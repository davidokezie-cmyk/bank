import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.22),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(244,182,73,0.18),transparent_25%),#0b0a14] px-4 py-10 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[680px] overflow-hidden bg-[linear-gradient(135deg,rgba(139,92,246,0.28),rgba(17,18,30,0.88))] p-8 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),transparent_40%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f7d07a]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f7d07a] shadow-[0_0_16px_rgba(247,208,122,0.8)]" />
                Demo mode ready
              </div>
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-xs flex-col items-center justify-center text-center">
              <div className="relative mb-8 flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-[0_30px_70px_rgba(109,94,246,0.35)]">
                <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle,_rgba(255,210,110,0.92),rgba(139,92,246,0.55))] blur-[2px]" />
                <div className="relative h-28 w-28 rounded-full bg-[linear-gradient(145deg,#ffd56e,#f5b83d_45%,#d99015)] shadow-[inset_0_10px_18px_rgba(255,255,255,0.25)]">
                  <span className="absolute left-7 top-10 h-3.5 w-3.5 rounded-full bg-[#1b120f]" />
                  <span className="absolute right-7 top-10 h-3.5 w-3.5 rounded-full bg-[#1b120f]" />
                  <span className="absolute bottom-8 left-1/2 h-6 w-10 -translate-x-1/2 rounded-b-[28px] border-b-[5px] border-[#3a2412]" />
                </div>
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
                Buy what you love.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-200/80">
                Split pay, save intentionally, and grow life goals without losing momentum.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-200/80">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#f7d07a]">Momentum</p>
                <p className="mt-1 text-white">72% of your rent goal is funded.</p>
              </div>
              <div className="rounded-full bg-[#6d5ef6]/20 px-3 py-1 text-xs font-medium text-[#f5f3ff]">
                +₦18,400
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between">
              <Link href="/" className="text-sm text-slate-300 transition hover:text-white">
                ← back home
              </Link>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                secure login
              </div>
            </div>

            <div className="mb-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7d07a]">Welcome back</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Log in to Buy & Build</h2>
            </div>

            <form className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue="alex@buyandbuild.app"
                  className="w-full rounded-2xl border border-white/10 bg-[#111426] px-4 py-3 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-[#8b5cf6]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm text-slate-300">
                    Password
                  </label>
                  <button type="button" className="text-sm text-[#d8ccff] transition hover:text-white">
                    Forgot?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  defaultValue="password123"
                  className="w-full rounded-2xl border border-white/10 bg-[#111426] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-[#8b5cf6]"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                <span>Continue in demo mode</span>
                <button
                  type="button"
                  className="relative h-6 w-11 rounded-full bg-[#3d375a] transition after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-['']"
                  aria-label="Toggle demo mode"
                >
                  <span className="sr-only">Toggle demo mode</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#8b5cf6,#5f6cf7)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_22px_38px_rgba(109,94,246,0.35)] transition hover:-translate-y-0.5"
              >
                Log in
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
              <span className="h-px flex-1 bg-white/10" />
              or
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <button className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#0f1220] px-5 py-3.5 text-sm font-medium text-white transition hover:border-[#8b5cf6]/60 hover:bg-[#111827]">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#0b0a14]">G</span>
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-slate-300">
              New here?{" "}
              <Link href="/sign-up" className="font-semibold text-[#d8ccff] hover:text-white">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
