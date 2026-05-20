import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Unique Hub",
  description:
    "Read the terms and conditions governing your use of the Unique Hub platform and services.",
};

const LAST_UPDATED = "May 20, 2026";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      'By accessing or using the Unique Hub website (uniquehub.store), mobile application, or any related services (collectively, the "Platform"), you confirm that you are at least 18 years of age, have read and understood these Terms & Conditions, and agree to be legally bound by them.',
      "If you do not agree with any part of these terms, you must discontinue use of the Platform immediately. We reserve the right to modify these terms at any time. Continued use after changes are posted constitutes your acceptance of the updated terms.",
    ],
  },
  {
    id: "account",
    title: "2. Account Registration",
    content: [
      "To access certain features — such as placing orders, saving wishlists, or tracking purchases — you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account details up to date.",
      "You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at support@uniquehub.store if you suspect any unauthorised use of your account.",
      "Unique Hub reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or are found to be inactive for extended periods.",
    ],
  },
  {
    id: "products",
    title: "3. Products & Pricing",
    content: [
      "All products listed on the Platform are subject to availability. We make every effort to ensure product descriptions, images, and pricing are accurate; however, errors may occasionally occur. We reserve the right to correct any pricing errors and cancel orders placed at an incorrect price, with a full refund to the customer.",
      "Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Shipping charges, if any, are displayed separately at checkout.",
      "Product colours may vary slightly from what is shown on screen due to differences in display settings and lighting conditions used in photography.",
    ],
  },
  {
    id: "orders",
    title: "4. Orders & Payments",
    content: [
      "When you place an order on Unique Hub, you are making an offer to purchase a product. We reserve the right to accept or decline any order at our discretion. An order is confirmed only after you receive an official order confirmation from us.",
      "We currently process payments via WhatsApp confirmation. After placing an order, you will be prompted to send your order details to our team on WhatsApp. Payment is to be made via UPI, bank transfer, or other agreed methods as communicated by our team.",
      "Stock is reserved only upon successful order confirmation. In the event a product becomes unavailable after your order is confirmed, we will notify you and offer a full refund or suitable replacement.",
    ],
  },
  {
    id: "shipping",
    title: "5. Shipping & Delivery",
    content: [
      "We ship to locations across India. Delivery timelines are estimates and may vary based on your location, courier partner performance, and external factors such as public holidays or weather disruptions.",
      "Standard delivery takes 3-7 business days from the date of dispatch. Expedited options may be available for select pin codes. You will receive tracking information once your order is dispatched.",
      "Unique Hub is not liable for delays caused by third-party courier services, incorrect delivery addresses provided by the customer, or force majeure events.",
    ],
  },
  {
    id: "returns",
    title: "6. Returns & Exchanges",
    content: [
      "We want you to love what you ordered. If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery at support@uniquehub.store with your order number and photographs of the issue.",
      "Returns or exchanges are accepted within 7 days of delivery, provided the product is unworn, unwashed, and has original tags intact. Products purchased during clearance sales or marked as Final Sale are not eligible for returns.",
      "Once your return is received and inspected, we will notify you of the approval or rejection of your refund. Approved refunds are processed within 5-7 business days to the original payment method.",
    ],
  },
  {
    id: "intellectual",
    title: "7. Intellectual Property",
    content: [
      "All content on the Unique Hub Platform — including but not limited to logos, product photographs, graphics, text, and design elements — is the exclusive property of Unique Hub or its content suppliers and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content from our Platform without prior written permission from Unique Hub.",
      "User-generated content (such as reviews or messages) grants Unique Hub a non-exclusive, royalty-free licence to use, display, and adapt that content in connection with our services.",
    ],
  },
  {
    id: "conduct",
    title: "8. Prohibited Conduct",
    content: [
      "When using the Platform, you agree not to: use it for any unlawful purpose or in violation of any applicable regulations; impersonate any person or entity; attempt to gain unauthorised access to any part of the Platform or its underlying systems; upload or transmit viruses or any other malicious code; or scrape, crawl, or harvest data from the Platform without our express written consent.",
      "Violation of these prohibitions may result in immediate termination of your account and may be reported to relevant law enforcement authorities.",
    ],
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: [
      "To the fullest extent permitted by applicable law, Unique Hub, its directors, employees, affiliates, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the Platform or its services.",
      "Our total aggregate liability for any claim arising out of or relating to these terms shall not exceed the total amount paid by you to Unique Hub in the three (3) months preceding the claim.",
      "Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you in their entirety.",
    ],
  },
  {
    id: "governing",
    title: "10. Governing Law & Disputes",
    content: [
      "These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.",
      "Before initiating any legal proceedings, both parties agree to attempt to resolve disputes amicably through good-faith negotiations for a period of at least 30 days.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: [
      "If you have any questions, concerns, or feedback regarding these Terms & Conditions, please reach out to us:",
      "Email: support@uniquehub.store\nPhone: +91 98765 43210\nAddress: Mumbai, Maharashtra, India",
    ],
  },
];

export default function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-zinc-500 mt-3 text-sm leading-relaxed max-w-lg">
            Please read these terms carefully before using the Unique Hub platform.
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
              Questions about these terms?{" "}
              <a
                href="mailto:support@uniquehub.store"
                className="text-brand font-semibold hover:underline"
              >
                support@uniquehub.store
              </a>
            </p>
            <p className="text-xs text-zinc-400">
              Also read our{" "}
              <Link href="/privacy" className="text-brand font-semibold hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
