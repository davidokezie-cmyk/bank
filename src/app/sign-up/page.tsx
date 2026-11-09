import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.22),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(244,182,73,0.18),transparent_25%),#0b0a14] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(244,182,73,0.2),rgba(139,92,246,0.24),rgba(17,18,30,0.9))] p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),transparent_35%)]" />
              <div className="relative z-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7d07a]">Start your story</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-white">
                  Build wealth as you live.
                </h1>
                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-200/80">
                  Create a plan for spending, saving, goals, and joint pots in one place.
                </p>

                <div className="mt-10 space-y-4">
                  {[
                    "Split salary across lifestyle priorities",
                    "Auto-save on qualifying purchases",
                    "Track shared goals with friends and family",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-200">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f7d07a] text-[#0b0a14] font-bold">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="text-sm text-slate-300 transition hover:text-white">
                  ← home
                </Link>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300">
                  create account
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#f7d07a]">New account</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Sign up</h2>
              </div>

              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">First name</label>
                    <input className="w-full rounded-2xl border border-white/10 bg-[#111426] px-4 py-3 text-white outline-none focus:border-[#8b5cf6]" defaultValue="Alex" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Last name</label>
                    <input className="w-full rounded-2xl border border-white/10 bg-[#111426] px-4 py-3 text-white outline-none focus:border-[#8b5cf6]" defaultValue="Adebayo" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Email address</label>
                  <input type="email" className="w-full rounded-2xl border border-white/10 bg-[#111426] px-4 py-3 text-white outline-none focus:border-[#8b5cf6]" defaultValue="alex@buyandbuild.app" />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Password</label>
                  <input type="password" className="w-full rounded-2xl border border-white/10 bg-[#111426] px-4 py-3 text-white outline-none focus:border-[#8b5cf6]" defaultValue="password123" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3 text-sm text-slate-300">
                    <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-[#8b5cf6]" />
                    <span>
                      I agree to the <span className="text-[#d8ccff]">terms</span> and consent to demo-mode financial planning.
                    </span>
                  </div>
                </div>

                <button type="submit" className="w-full rounded-2xl bg-[linear-gradient(135deg,#8b5cf6,#5f6cf7)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_22px_38px_rgba(109,94,246,0.35)] transition hover:-translate-y-0.5">
                  Create account
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-300">
                Already a member?{" "}
                <Link href="/login" className="font-semibold text-[#d8ccff] hover:text-white">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
