import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Unique Hub",
  description: "Learn how Unique Hub collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "May 20, 2026";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: [
      "At Unique Hub, your privacy is a priority. This Privacy Policy explains what personal information we collect when you use our website (uniquehub.store) and related services, how we use and protect it, and the choices you have regarding your data.",
      "By using the Unique Hub Platform, you consent to the practices described in this policy. If you do not agree, please discontinue use of our services.",
    ],
  },
  {
    id: "what-we-collect",
    title: "2. Information We Collect",
    content: [
      "We collect information you provide directly: account details (name, email, phone number, password), order and shipping information (delivery address, order history), communications you send us via email or WhatsApp, and profile data such as saved addresses and wishlist items.",
      "We also collect information automatically when you use the Platform: pages visited, time spent, search queries, IP address, browser type, operating system, and data from cookies and similar tracking technologies.",
      "We may also receive information from third parties, such as authentication data when you sign in via Google or payment verification data from payment processors.",
    ],
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    content: [
      "We use your information to process, fulfil, and manage your orders; to create and maintain your account; to communicate order updates, shipping notifications, and customer support responses; to send promotional offers and new arrivals (only with your consent); to improve our Platform and analyse usage trends; to detect and prevent fraud, abuse, and security threats; and to comply with applicable legal obligations under Indian law.",
    ],
  },
  {
    id: "sharing",
    title: "4. How We Share Your Information",
    content: [
      "We do not sell, rent, or trade your personal data to third parties for their marketing purposes.",
      "We share your data only with: delivery partners and logistics companies to fulfil your shipments; payment processors to facilitate secure transactions; cloud and hosting providers to operate our Platform infrastructure; analytics tools to understand usage patterns (data is aggregated and anonymised where possible); and law enforcement when required by law or to protect the rights and safety of Unique Hub and its users.",
      "All third-party service providers are contractually required to keep your data confidential and use it only for the purposes we specify.",
    ],
  },
  {
    id: "data-retention",
    title: "5. Data Retention",
    content: [
      "We retain your personal information for as long as your account is active or as needed to provide services. Order records are retained for a minimum of 5 years to comply with Indian accounting and tax regulations.",
      "If you request account deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as resolving disputes.",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking Technologies",
    content: [
      "We use cookies and similar technologies to remember your preferences, keep you logged in, understand how you interact with our Platform, and measure the effectiveness of our marketing.",
      "Types of cookies we use: essential cookies (required for the Platform to function — cart, authentication), analytics cookies (help us understand how visitors use the site), and marketing cookies (used to deliver relevant promotions, only with consent).",
      "You can control cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of some features.",
    ],
  },
  {
    id: "security",
    title: "7. Data Security",
    content: [
      "We implement industry-standard security measures to protect your data, including encrypted data transmission (HTTPS/TLS), hashed password storage, and access controls limiting who can view your personal information.",
      "While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password and to contact us immediately if you suspect any unauthorised access to your account.",
    ],
  },
  {
    id: "rights",
    title: "8. Your Rights",
    content: [
      "Subject to applicable law, you have the right to: access a copy of the personal information we hold about you; request correction of inaccurate or incomplete data; request deletion of your account and associated data; receive your data in a portable, machine-readable format; and opt out of marketing communications at any time via the unsubscribe link in any email or by contacting support.",
      "To exercise any of these rights, email us at support@uniquehub.store with 'Privacy Request' in the subject line. We will respond within 30 days.",
    ],
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content: [
      "The Unique Hub Platform is intended for users who are 18 years of age or older. We do not knowingly collect personal information from minors. If we become aware that a child under 18 has provided us with personal data without parental consent, we will delete that information promptly.",
      "If you believe your child has submitted information to us, please contact us immediately at support@uniquehub.store.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content: [
      "We may update this Privacy Policy periodically to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will notify you via email or a prominent notice on the Platform prior to the changes taking effect.",
      "Your continued use of the Platform after any update constitutes your acceptance of the revised policy.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact & Grievances",
    content: [
      "If you have questions, concerns, or grievances about this Privacy Policy or our data practices, please reach out to our Privacy Team:",
      "Email: support@uniquehub.store\nPhone: +91 70769 47260\nAddress: Dhubulia, Krishnagar, Nadia — Pin 741140",
      "If you are not satisfied with our response, you may lodge a complaint with the relevant data protection authority in India.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="border-b border-zinc-100 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-700 text-sm font-medium transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Home
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-950">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 mt-3 text-sm leading-relaxed max-w-lg">
            We believe you should know exactly how your data is collected, used, and protected.
          </p>
          <p className="text-zinc-400 text-xs mt-4">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-base font-black tracking-tight text-zinc-900 mb-4 uppercase">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((para, i) => (
                  <p
                    key={i}
                    className="text-sm text-zinc-600 leading-7 whitespace-pre-line"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Divider */}
          <div className="border-t border-zinc-100 pt-10 space-y-3">
            <p className="text-xs text-zinc-400">
              Privacy questions?{" "}
              <a
                href="mailto:support@uniquehub.store"
                className="text-brand font-semibold hover:underline"
              >
                support@uniquehub.store
              </a>
            </p>
            <p className="text-xs text-zinc-400">
              Also read our{" "}
              <Link href="/terms" className="text-brand font-semibold hover:underline">
                Terms &amp; Conditions
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
