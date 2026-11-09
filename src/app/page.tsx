import Link from "next/link";

const stats = [
  { label: "members growing", value: "18.4k" },
  { label: "avg. save rate", value: "31%" },
  { label: "joint pots created", value: "6.2k" },
];

const features = [
  {
    title: "Salary Split",
    description:
      "Divide each paycheck across spending, savings, and named lifestyle goals with totals locked to 100%.",
    accent: "Spend with clarity",
  },
  {
    title: "Shop & Save",
    description:
      "Turn a qualifying purchase into a separate contribution with fixed, percentage, or round-up rules.",
    accent: "₦40,000 @ 5% = ₦2,000",
  },
  {
    title: "Lifestyle Goals",
    description:
      "Track rent, travel, education, business, and everything in between with deadline-driven progress.",
    accent: "Built around real life",
  },
];

const highlights = [
  "Clear savings vs. investing separation",
  "Joint pots with approvals, voting, and refunds",
  "Demo mode with explicit opt-in before every money action",
];

const faqs = [
  {
    question: "Is this a real bank?",
    answer:
      "No. Buy & Build is a demo-mode prototype and customer-experience layer. Regulated partners would handle the real financial services later.",
  },
  {
    question: "What happens in demo mode?",
    answer:
      "All money actions are simulated. The app clearly labels demo mode and keeps every contribution opt-in.",
  },
  {
    question: "Can I save with friends?",
    answer:
      "Yes. Joint pots support invites, contribution tracking, member roles, approval rules, and proportional refunds.",
  },
];

export default function Home() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-mark-inner" />
          </div>
          <div>
            <p className="brand-kicker">Buy & Build</p>
            <p className="brand-sub">Lifestyle money</p>
          </div>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <Link href="#features">Features</Link>
          <Link href="#why">Why it works</Link>
          <Link href="#joint">Joint savings</Link>
          <Link href="#faq">FAQ</Link>
        </nav>

        <div className="nav-actions">
          <Link href="/login" className="nav-link ghost">
            Log in
          </Link>
          <Link href="/sign-up" className="nav-link primary">
            Get started
          </Link>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Buy What You Love. Build Wealth As You Live.</span>
          <h1>
            A better way to <span>buy</span>
            <br />
            the life you want,
            <br />
            without losing the plan.
          </h1>
          <p>
            Built for Nigerian lifestyles: split pay, save intentionally, grow goals, and save together with friends and family.
          </p>

          <div className="cta-row">
            <Link href="/sign-up" className="cta primary">
              Start free
            </Link>
            <Link href="#features" className="cta secondary">
              Explore the app
            </Link>
          </div>

          <div className="proof-row" aria-label="Key product statistics">
            {stats.map((item) => (
              <div key={item.label} className="proof-item">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Kobo mascot illustration">
          <div className="orb orb-gold" />
          <div className="orb orb-violet" />
          <div className="kobo-stage">
            <div className="kobo-card">
              <div className="coin-rim" />
              <div className="coin-body">
                <div className="coin-strap" />
                <div className="coin-face">
                  <span className="eye left" />
                  <span className="eye right" />
                  <span className="smile" />
                </div>
              </div>
              <div className="block-stack" aria-hidden="true">
                <span className="block b1" />
                <span className="block b2" />
                <span className="block b3" />
              </div>
            </div>
          </div>

          <div className="floating-card card-one">
            <span className="label">Shop • Save</span>
            <strong>₦2,000</strong>
            <small>from 5% on a ₦40k purchase</small>
          </div>

          <div className="floating-card card-two">
            <span className="label">Goal progress</span>
            <strong>72%</strong>
            <small>Rent fund target</small>
          </div>
        </div>
      </section>

      <section id="features" className="content-section">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Designed for the way real people move money.</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article key={feature.title} className="feature-card">
              <div className="feature-index">0{index + 1}</div>
              <div className="feature-topline">{feature.accent}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="why" className="content-section alt-panel">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Why people stay</span>
            <h2>Modern control without financial chaos.</h2>
          </div>
          <Link href="/login" className="text-link">
            See the demo flow →
          </Link>
        </div>

        <div className="dual-grid">
          <div className="glass-panel">
            <h3>Built for real life</h3>
            <ul>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="glass-panel accent-panel">
            <div className="mini-metric">
              <span>Available to spend</span>
              <strong>₦84,750</strong>
            </div>
            <div className="mini-metric">
              <span>Available to save</span>
              <strong>₦52,300</strong>
            </div>
            <div className="mini-metric">
              <span>Goal contribution</span>
              <strong>₦18,400</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="joint" className="content-section">
        <div className="section-heading">
          <span className="eyebrow">Joint savings</span>
          <h2>Save together with structure, trust, and fewer surprises.</h2>
        </div>

        <div className="joint-grid">
          <div className="joint-card large">
            <div className="joint-badge">Majority rule</div>
            <h3>Lagos Rent Fund</h3>
            <div className="pot-bar">
              <span style={{ width: "72%" }} />
            </div>
            <div className="pot-figures">
              <strong>₦1,240,000</strong>
              <span>of ₦1,700,000</span>
            </div>
          </div>

          <div className="joint-card small">
            <h3>Included</h3>
            <ul>
              <li>Invite by username, phone, or email</li>
              <li>Accept/decline flows with 7-day expiry</li>
              <li>Member roles, votes, and proportional refunds</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="content-section faq-section">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>Everything people ask before they trust the product.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <article key={faq.question} className="faq-item">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <span className="eyebrow">Demo mode</span>
          <h2>Start with the story, then replace the provider layer later.</h2>
        </div>
        <Link href="/login" className="cta primary large">
          Launch the prototype
        </Link>
      </section>
    </main>
  );
}
