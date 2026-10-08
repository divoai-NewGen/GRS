import React from "react";
import Link from "next/link";
import {
  QrCode,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Store,
  Sparkles,
  Wifi,
  CheckCircle,
  HelpCircle,
  Scissors,
  UtensilsCrossed,
  Coffee,
  Hotel,
  Dumbbell,
  Stethoscope,
  ShoppingBag,
  Star,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const useCases = [
    {
      title: "Salons & Spas",
      desc: "Place durable GrowBroo cards at styling chairs and checkout reception desks.",
      icon: Scissors,
    },
    {
      title: "Restaurants & Bistros",
      desc: "Place scannable table displays or slip into the check presenter at dessert.",
      icon: UtensilsCrossed,
    },
    {
      title: "Cafes & Bakeries",
      desc: "Capture reviews at pickup bars while customers wait for fresh drinks.",
      icon: Coffee,
    },
    {
      title: "Hotels & Stays",
      desc: "Empower front-desk teams to capture genuine 5-star ratings during checkout.",
      icon: Hotel,
    },
    {
      title: "Gyms & Fitness",
      desc: "Let personal training clients review their session right at the exit turnstile.",
      icon: Dumbbell,
    },
    {
      title: "Clinics & Dentists",
      desc: "Provide stress-free, convenient review access for patients in waiting areas.",
      icon: Stethoscope,
    },
    {
      title: "Retail Boutiques",
      desc: "Drop compact branded cards inside customer shopping bags at purchase.",
      icon: ShoppingBag,
    },
    {
      title: "Auto & Services",
      desc: "Hand cards to clients with their keys after service or repair completion.",
      icon: Store,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Factory Pre-Printed Cards",
      desc: "GrowBroo cards are manufactured with permanent redirect tokens (e.g. /r/AB12CD) and embedded NFC chips.",
    },
    {
      step: "02",
      title: "Instant Digital Assignment",
      desc: "Assign cards to any business in 5 seconds. Input their official Google review request link.",
    },
    {
      step: "03",
      title: "Place in Customer Reach",
      desc: "Deploy physical cards on tables, reception desks, or checkout counters. Zero reprints needed.",
    },
    {
      step: "04",
      title: "Customer Taps or Scans",
      desc: "Customer taps with NFC or points their phone camera at the QR code—no app install required.",
    },
    {
      step: "05",
      title: "Instant Google Deep-Link",
      desc: "Our server checks the card and instantly fires a high-speed redirect straight to the business review modal.",
    },
    {
      step: "06",
      title: "Track Scans in Real Time",
      desc: "Monitor live scan counts, hardware devices, and customer engagement directly on the dashboard.",
    },
  ];

  const plans = [
    {
      name: "Starter",
      badge: "Local Storefront",
      price: "$29",
      period: "per month",
      cards: "Up to 5 Physical Cards",
      features: [
        "Dynamic URL re-routing",
        "Basic scan telemetry",
        "Instant card reassignment",
        "Standard QR generation",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Growth",
      badge: "Most Popular",
      price: "$79",
      period: "per month",
      cards: "Up to 25 Physical Cards",
      features: [
        "Dynamic URL re-routing",
        "Real-time analytics & device breakdown",
        "Card reassignment anytime without reprints",
        "Dedicated business owner login",
        "NFC + QR dual architecture",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Scale",
      badge: "Multi-Location",
      price: "$199",
      period: "per month",
      cards: "Up to 100 Physical Cards",
      features: [
        "Everything in Growth",
        "Bulk CSV inventory import",
        "Printable CR-80 card designer",
        "Comprehensive audit logs",
        "Multi-location franchise grouping",
      ],
      popular: false,
    },
    {
      name: "Enterprise",
      badge: "Agency / Franchise",
      price: "Custom",
      period: "billed annually",
      cards: "Unlimited Cards",
      features: [
        "Custom domain routing",
        "White-label dashboards",
        "Dedicated account manager",
        "Custom branded card batch manufacturing",
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Why use GrowBroo dynamic cards instead of a static QR code?",
      a: "Static QR codes permanently hardcode a single Google URL. If the business ever moves, changes ownership, or you want to transfer cards, static QR cards must be discarded. GrowBroo cards use permanent platform URLs that can be dynamically reassigned in seconds without ever reprinting the physical cards.",
    },
    {
      q: "Does GrowBroo comply with Google Review Guidelines?",
      a: "Yes, 100%. GrowBroo does not gate reviews, filter negative feedback, offer incentives, or post fake reviews. Customers are directed directly to the business's official Google review page to share their honest feedback.",
    },
    {
      q: "Does GrowBroo support NFC tap as well as QR scans?",
      a: "Yes. Both the printed QR code and the embedded NFC wireless chip point to the exact same dynamic redirect address (e.g. /r/7FhK92xQ). Tapping or scanning resolves immediately.",
    },
    {
      q: "What happens if a card is unassigned or disabled?",
      a: "Customers are shown a friendly, branded status screen explaining that the card has not been activated yet, protecting your database with zero leaked IDs.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FBF7] text-[#050505] selection:bg-[#006B21] selection:text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#F7FBF7]/90 backdrop-blur-md border-b border-[#006B21]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#006B21] flex items-center justify-center shadow-md shadow-[#006B21]/20 text-white">
              <QrCode className="w-5 h-5 text-[#39E900]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#050505]">
                Grow<span className="text-[#006B21]">Broo</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-[#050505]/70">
            <a href="#how-it-works" className="hover:text-[#006B21] transition-colors">
              How It Works
            </a>
            <a href="#use-cases" className="hover:text-[#006B21] transition-colors">
              Use Cases
            </a>
            <a href="#pricing" className="hover:text-[#006B21] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#006B21] transition-colors">
              FAQ
            </a>
            <Link href="/contact" className="text-[#006B21] font-extrabold hover:underline transition-colors">
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#006B21] hover:bg-[#005219] text-white shadow-md shadow-[#006B21]/20 transition-all flex items-center gap-1.5"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 text-[#39E900]" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E9F8E9] border border-[#006B21]/20 text-[#006B21] text-xs font-bold mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#006B21]" />
            Dynamic QR & NFC Review Card Platform for Local Businesses
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#050505] max-w-4xl mx-auto leading-[1.08]">
            Turn Every Customer Interaction Into an{" "}
            <span className="text-[#006B21] relative inline-block">
              Easy Review
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#39E900]/25 -z-10 rounded"></span>
            </span>{" "}
            Opportunity.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#050505]/70 max-w-2xl mx-auto leading-relaxed">
            Pre-printed smart cards that route customers directly to your Google Review page. Reassign destinations anytime without reprinting cards.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#006B21] hover:bg-[#005219] text-white font-bold text-sm shadow-xl shadow-[#006B21]/25 flex items-center justify-center gap-2.5 transition-all group"
            >
              Launch Portal Demo
              <ArrowRight className="w-4 h-4 text-[#39E900] group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E9F8E9] hover:bg-[#d8f4d8] text-[#006B21] font-bold text-sm border border-[#006B21]/20 flex items-center justify-center transition-all"
            >
              See How It Works
            </a>
          </div>

          {/* Live Interactive Card Mockup Preview */}
          <div className="mt-16 max-w-md mx-auto p-6 rounded-3xl bg-[#10251A] text-white shadow-2xl border border-[#006B21]/30 relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs">
              <span className="flex items-center gap-2 font-bold text-white">
                <Wifi className="w-3.5 h-3.5 text-[#39E900] rotate-90" />
                Physical GrowBroo Card
              </span>
              <span className="font-mono text-[#39E900] font-bold bg-[#006B21]/40 px-2.5 py-0.5 rounded-full">
                /r/CARD0001
              </span>
            </div>

            <div className="py-6 flex items-center gap-6">
              <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-lg shrink-0 flex items-center justify-center">
                <QrCode className="w-20 h-20 text-[#050505]" />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#39E900]">
                  Dynamic Resolver
                </div>
                <div className="text-base font-black text-white">
                  Royal Salon NY
                </div>
                <div className="text-xs text-white/70 leading-snug">
                  Customer scans or taps → Instant redirect to Google review form.
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-white/60 flex items-center justify-between">
              <span className="font-mono text-[#39E900]">CARD-0001</span>
              <span className="text-[#39E900] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39E900] animate-pulse"></span>
                100% Reassignable
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-[#E9F8E9] border-t border-[#006B21]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006B21] mb-2 block">
              Workflow Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#050505] tracking-tight">
              How GrowBroo Works
            </h2>
            <p className="mt-3 text-sm text-[#050505]/70 leading-relaxed">
              Never reprint QR codes again. Manufacture once, deploy anywhere, reassign in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#F7FBF7] border border-[#006B21]/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-[#006B21] font-mono">
                    {s.step}
                  </span>
                  <h3 className="text-base font-bold text-[#050505] mt-2 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#050505]/70 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Technology Advantage */}
      <section id="technology" className="py-24 border-t border-[#006B21]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E9F8E9] text-[#006B21] text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-[#006B21]" />
                The Dynamic Advantage
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#050505] tracking-tight leading-tight">
                Static QR codes get thrown away.{" "}
                <span className="text-[#006B21]">GrowBroo cards are reusable forever.</span>
              </h2>

              <p className="text-sm text-[#050505]/70 leading-relaxed">
                Standard QR cards lock you into a single web link. If the business changes location, changes name, or cancels, physical cards become useless trash. GrowBroo cards bind to dynamic platform tokens that can be reassigned with a single click.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#E9F8E9] border border-[#006B21]/20 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#006B21] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#050505]">Permanent Token URLs</h4>
                    <p className="text-xs text-[#050505]/70 mt-0.5">
                      The printed code points strictly to your GrowBroo redirect cloud (/r/token).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E9F8E9] border border-[#006B21]/20 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#006B21] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#050505]">One-Click Card Reassignment</h4>
                    <p className="text-xs text-[#050505]/70 mt-0.5">
                      Move CARD0001 from Royal Salon to Food Hub instantly. No reprint needed.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#E9F8E9] border border-[#006B21]/20 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#006B21] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#050505]">Real-Time Scan Telemetry</h4>
                    <p className="text-xs text-[#050505]/70 mt-0.5">
                      Track scans, devices, and browsers with fraud protection and rate limits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark Forest Promotional Comparison Box */}
            <div className="p-8 rounded-3xl bg-[#10251A] text-white border border-[#006B21]/40 shadow-xl space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#39E900]" />
                Side-by-Side Comparison
              </h3>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-rose-400">❌ Typical Static QR Cards</div>
                <div className="text-xs font-mono text-white/70">
                  Scan → Hardcoded Google URL → Fixed Forever
                </div>
                <div className="text-[11px] text-white/50">
                  Zero reusability. Any destination change means throwing away the entire print batch.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#006B21]/30 border border-[#39E900]/40 space-y-1.5">
                <div className="text-xs font-bold text-[#39E900]">✅ GrowBroo Dynamic Review System</div>
                <div className="text-xs font-mono text-white">
                  Scan → /r/[publicToken] → Lookup Business → 307 Redirect
                </div>
                <div className="text-[11px] text-white/80">
                  100% reusable, reassignable anytime, live scan logs, bot and spam rate limiting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section id="use-cases" className="py-24 bg-[#E9F8E9] border-t border-[#006B21]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006B21] mb-2 block">
              Built For Local Businesses
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#050505] tracking-tight">
              Where GrowBroo Shines
            </h2>
            <p className="mt-3 text-sm text-[#050505]/70">
              Put cards right where delighted customers finish their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-[#F7FBF7] border border-[#006B21]/15 hover:border-[#006B21] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-[#E9F8E9] text-[#006B21] flex items-center justify-center mb-4 group-hover:bg-[#006B21] group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#050505] mb-1.5">{uc.title}</h3>
                    <p className="text-xs text-[#050505]/70 leading-relaxed">{uc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 border-t border-[#006B21]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006B21] mb-2 block">
              Transparent Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#050505] tracking-tight">
              Simple, Predictable Pricing
            </h2>
            <p className="mt-3 text-sm text-[#050505]/70">
              Pick the volume of review cards tailored to your business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl bg-white border flex flex-col justify-between transition-all ${
                  p.popular
                    ? "border-[#006B21] ring-2 ring-[#006B21] shadow-xl relative"
                    : "border-[#006B21]/20 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#006B21]">
                      {p.badge}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-[#050505]">{p.name}</h4>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#050505]">{p.price}</span>
                    <span className="text-xs text-[#050505]/60">/{p.period}</span>
                  </div>

                  <div className="mt-4 text-xs font-bold text-[#006B21] pb-4 border-b border-[#006B21]/15">
                    {p.cards}
                  </div>

                  <ul className="mt-4 space-y-2.5 text-xs text-[#050505]/80">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#006B21] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-[#006B21]/15">
                  <Link
                    href="/login"
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      p.popular
                        ? "bg-[#006B21] hover:bg-[#005219] text-white shadow-md shadow-[#006B21]/20"
                        : "bg-[#E9F8E9] hover:bg-[#d8f4d8] text-[#006B21]"
                    }`}
                  >
                    Select {p.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-[#E9F8E9] border-t border-[#006B21]/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#006B21] mb-2 block">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#050505] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#F7FBF7] border border-[#006B21]/15 space-y-2"
              >
                <h4 className="text-base font-bold text-[#050505] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#006B21] shrink-0" />
                  {f.q}
                </h4>
                <p className="text-xs text-[#050505]/70 leading-relaxed pl-6">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Forest Promotional Footer */}
      <footer className="py-12 bg-[#10251A] text-white text-xs border-t border-[#006B21]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#006B21] flex items-center justify-center text-[#39E900]">
              <QrCode className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">GrowBroo</span>
            <span className="text-white/40">Dynamic Review Card Network</span>
          </div>

          <div className="text-white/60 text-center sm:text-left">
            © 2026 GrowBroo Inc. All rights reserved. Built for genuine, policy-compliant feedback.
          </div>

          <div className="flex items-center gap-4 text-white/70">
            <Link href="/login" className="hover:text-[#39E900] transition-colors font-semibold">
              Admin Login
            </Link>
            <Link href="/login" className="hover:text-[#39E900] transition-colors font-semibold">
              Client Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
