import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Split your income",
    text: "Give spending, savings, and each named goal a clear share. Your split adds up to exactly 100%.",
    detail: "Salary Split",
  },
  {
    number: "02",
    title: "Save as you shop",
    text: "Choose a fixed amount, percentage, or round-up. Contributions stay separate and always need your opt-in.",
    detail: "Shop & Save",
  },
  {
    number: "03",
    title: "Make room for goals",
    text: "Track progress toward the things you care about, from rent and education to a well-earned trip.",
    detail: "Lifestyle Goals",
  },
];

const faqs = [
  {
    question: "Does Buy & Build move or hold real money?",
    answer:
      "No. This prototype is a product demo only. No real money is moved, stored, or held. Regulated partners would provide financial services in a production experience.",
  },
  {
    question: "How does Shop & Save work?",
    answer:
      "You choose a fixed, percentage, or round-up rule and explicitly opt in. For example, 5% of a ₦40,000 eligible purchase is a separate ₦2,000 contribution—not a discount. You can pause or change the rule any time.",
  },
  {
    question: "Can I save with other people?",
    answer:
      "The prototype includes joint-savings concepts with member roles, contribution activity, and withdrawal approvals. Joint pots are savings-only.",
  },
  {
    question: "Are investment returns guaranteed?",
    answer:
      "No. Investments are not the same as savings, involve risk, and are not offered as real products in this demo. Any future investment experience would be partner-powered with risk information.",
  },
];

function KoboIllustration() {
  return (
    <div className="hero-art" role="img" aria-label="Kobo, the gold coin mascot, beside a stack of building blocks">
      <div className="hero-art-glow" />
      <div className="coin-orbit orbit-a" />
      <div className="coin-orbit orbit-b" />
      <div className="kobo-figure">
        <div className="kobo-backpack-strap" />
        <div className="kobo-coin">
          <span className="kobo-eye eye-a" />
          <span className="kobo-eye eye-b" />
          <span className="kobo-mouth" />
          <span className="kobo-highlight" />
        </div>
        <div className="kobo-feet"><span /><span /></div>
      </div>
      <div className="hero-blocks" aria-hidden="true">
        <span className="hero-block block-lilac" />
        <span className="hero-block block-mint" />
        <span className="hero-block block-cream" />
        <span className="hero-block block-violet" />
      </div>
      <div className="hero-note note-save"><span className="note-dot" /> Your goals, in reach</div>
      <div className="hero-note note-demo">Demo mode · no real money moves</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="marketing-page">
      <div className="marketing-glow marketing-glow-left" aria-hidden="true" />
      <div className="marketing-glow marketing-glow-right" aria-hidden="true" />
      <header className="marketing-nav">
        <Link className="marketing-brand" href="/" aria-label="Buy & Build home">
          <span className="brand-coin" aria-hidden="true"><span /></span>
          <span><strong>BUY & BUILD</strong><small>Money for real life</small></span>
        </Link>
        <nav className="marketing-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#together">Together</a>
          <a href="#trust">Trust</a>
        </nav>
        <div className="marketing-nav-actions">
          <Link className="button button-quiet" href="/login">Log in</Link>
          <Link className="button button-primary button-nav-cta" href="/sign-up">Explore the demo <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section className="marketing-hero">
        <div className="hero-content">
          <p className="overline"><span className="overline-line" /> Made for the life you’re building</p>
          <h1>Enjoy today.<br /><span>Build for tomorrow.</span></h1>
          <p className="hero-description">A more thoughtful way to manage everyday spending, build savings habits, and make progress on the goals that matter to you.</p>
          <div className="hero-actions">
            <Link href="/sign-up" className="button button-primary button-large">Step into the demo <span aria-hidden="true">↗</span></Link>
            <a href="#how-it-works" className="button button-secondary button-large">See how it works</a>
          </div>
          <p className="hero-footnote"><span aria-hidden="true">✳</span> A product prototype for Nigeria · No real money moves</p>
        </div>
        <KoboIllustration />
      </section>

      <section className="brand-marquee" aria-label="Product principles">
        <span>BUY WHAT YOU LOVE</span><i aria-hidden="true">✳</i><span>BUILD WEALTH AS YOU LIVE</span><i aria-hidden="true">✳</i><span>YOUR MONEY, YOUR PACE</span>
      </section>

      <section id="how-it-works" className="marketing-section">
        <div className="section-intro">
          <p className="overline"><span className="overline-line" /> Your money, with more intention</p>
          <h2>One clear plan.<br /><span>More room for life.</span></h2>
          <p>Turn good intentions into small, manageable moves—without making money feel complicated.</p>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <article className="feature-row" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <div><p className="feature-detail">{feature.detail}</p><h3>{feature.title}</h3><p className="feature-description">{feature.text}</p></div>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="together" className="together-section">
        <div className="together-visual" aria-hidden="true">
          <div className="pot-circle"><span className="pot-center">₦</span><span className="pot-orbit orbit-one">Rent</span><span className="pot-orbit orbit-two">Trip</span><span className="pot-orbit orbit-three">Family</span></div>
          <div className="pot-caption">A shared goal, with clear ground rules.</div>
        </div>
        <div className="together-copy">
          <p className="overline"><span className="overline-line" /> Better, together</p>
          <h2>Big plans feel lighter<br /><span>when shared.</span></h2>
          <p>Set up a joint savings pot for a shared goal. Keep contributions visible, make roles clear, and agree how withdrawals work before you begin.</p>
          <ul className="check-list">
            <li><span>✓</span> Clear owner and member roles</li>
            <li><span>✓</span> Approval rules agreed up front</li>
            <li><span>✓</span> Savings only—no investments inside pots</li>
          </ul>
          <Link href="/sign-up" className="text-cta">Explore the joint-savings demo <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section id="trust" className="trust-section">
        <div className="trust-heading">
          <p className="overline"><span className="overline-line" /> Built with clarity</p>
          <h2>Trust starts with<br /><span>what we don’t hide.</span></h2>
        </div>
        <div className="trust-grid">
          <article className="trust-card"><span className="trust-icon" aria-hidden="true">◎</span><h3>Demo means demo</h3><p>No real funds are moved, stored, or held. Sample balances and activity are illustrative.</p></article>
          <article className="trust-card"><span className="trust-icon" aria-hidden="true">↗</span><h3>Choice stays yours</h3><p>Purchase-linked contributions require explicit opt-in. Pause, adjust, or opt out whenever you choose.</p></article>
          <article className="trust-card"><span className="trust-icon" aria-hidden="true">◇</span><h3>Savings ≠ investing</h3><p>They’re shown separately. Investments carry risk; returns are never promised or guaranteed.</p></article>
        </div>
      </section>

      <section id="faq" className="faq-section">
        <div className="faq-heading"><p className="overline"><span className="overline-line" /> Good to know</p><h2>Questions, answered.</h2></div>
        <div className="faq-grid">
          {faqs.map((faq) => <details className="faq-item" key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta-coin" aria-hidden="true"><span>₦</span></div>
        <p className="overline">A little more intention goes a long way</p>
        <h2>Make your next move<br /><span>feel like yours.</span></h2>
        <Link href="/sign-up" className="button button-primary button-large">Explore the demo <span aria-hidden="true">↗</span></Link>
        <p className="final-note">Demo experience only. No real money moves.</p>
      </section>

      <footer className="marketing-footer">
        <Link className="marketing-brand" href="/" aria-label="Buy & Build home"><span className="brand-coin" aria-hidden="true"><span /></span><span><strong>BUY & BUILD</strong><small>Buy What You Love. Build Wealth As You Live.</small></span></Link>
        <p>© 2026 Buy & Build · A demo product experience</p>
        <a href="#trust">How your money is handled</a>
      </footer>
    </main>
  );
}
