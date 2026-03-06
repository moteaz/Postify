import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { TableOfContents } from "@/components/legal/TableOfContents";
import { LegalSection } from "@/components/legal/LegalSection";
import Navbar from "@/components/landing/Navbar";
import LandingFooter from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms of Service for Postify - AI-powered job application platform",
};

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "service", title: "Description of Service" },
  { id: "oauth", title: "Google OAuth & Data Collection" },
  { id: "data-usage", title: "CV & Job Description Data Usage" },
  { id: "ai-disclaimer", title: "AI-Generated Content Disclaimer" },
  { id: "email", title: "Email Sending Feature" },
  { id: "responsibilities", title: "User Responsibilities" },
  { id: "ip", title: "Intellectual Property" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Information" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F9F7F4]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-12">
          <div className="max-w-3xl">
            <div className="mb-8">
              <Badge className="mb-4 bg-[#7C9EE8]/10 text-[#7C9EE8] border-[#7C9EE8]/20">
                Last updated: January 15, 2025
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#1C1917] mb-4 font-[family-name:var(--font-display)]">
                Terms & Conditions
              </h1>
              <p className="text-lg text-[#78716C]">
                Please read these terms carefully before using Postify.
              </p>
            </div>

            <div className="space-y-12">
              <LegalSection id="acceptance" title="Acceptance of Terms">
                <p>
                  By accessing or using Postify (&quot;the Service&quot;), you agree to be bound by these Terms & Conditions. 
                  If you do not agree to these terms, please do not use the Service.
                </p>
                <p>
                  These terms constitute a legally binding agreement between you and Postify. Your continued use of the 
                  Service signifies your acceptance of any updates or modifications to these terms.
                </p>
              </LegalSection>

              <LegalSection id="service" title="Description of Service">
                <p>
                  Postify is an AI-powered platform that helps users create personalized cover letters for job applications. 
                  The Service includes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Google OAuth authentication for secure account access</li>
                  <li>CV upload and storage functionality</li>
                  <li>Job description input and analysis</li>
                  <li>AI-generated cover letter creation</li>
                  <li>Email sending capabilities through your Gmail account</li>
                  <li>Application history tracking</li>
                </ul>
              </LegalSection>

              <LegalSection id="oauth" title="Google OAuth & Data Collection">
                <p>
                  When you sign up for Postify using Google OAuth, we collect and store the following information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Email address:</strong> Used for account identification and communication</li>
                  <li><strong>Full name:</strong> Used for personalization and account management</li>
                  <li><strong>Profile picture (avatar):</strong> Displayed in your account dashboard</li>
                </ul>
                <p>
                  By using Google OAuth, you authorize Postify to access this information from your Google account. 
                  We do not store your Google password or have access to other Google services without explicit permission.
                </p>
              </LegalSection>

              <LegalSection id="data-usage" title="CV & Job Description Data Usage">
                <p>
                  When you upload your CV and provide job descriptions, you grant Postify permission to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Store your CV files securely on our servers</li>
                  <li>Process CV content using AI to extract relevant information</li>
                  <li>Analyze job descriptions to identify key requirements</li>
                  <li>Generate personalized cover letters based on your CV and job descriptions</li>
                  <li>Retain application history for your reference</li>
                </ul>
                <p>
                  Your CV and job description data are used solely for providing the Service and are not shared with 
                  third parties except as required for AI processing or as disclosed in our Privacy Policy.
                </p>
              </LegalSection>

              <LegalSection id="ai-disclaimer" title="AI-Generated Content Disclaimer">
                <p>
                  Postify uses artificial intelligence to generate cover letters. While we strive for accuracy and quality:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>AI-generated content may contain errors, inaccuracies, or inappropriate language</li>
                  <li>You are solely responsible for reviewing and editing all generated content before sending</li>
                  <li>Postify does not guarantee that AI-generated cover letters will result in job offers or interviews</li>
                  <li>The quality of output depends on the quality of input (CV and job description)</li>
                </ul>
                <p>
                  <strong>You acknowledge that you are responsible for all content sent through the Service, 
                  including AI-generated cover letters.</strong>
                </p>
              </LegalSection>

              <LegalSection id="email" title="Email Sending Feature">
                <p>
                  Postify allows you to send cover letters directly via email through your Gmail account. By using this feature:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You authorize Postify to send emails on your behalf</li>
                  <li>Emails are sent from YOUR Gmail address, not from Postify</li>
                  <li>You are responsible for verifying recipient email addresses before sending</li>
                  <li>You must comply with anti-spam laws and email best practices</li>
                  <li>Postify is not responsible for delivery failures, bounced emails, or recipient responses</li>
                </ul>
                <p>
                  Misuse of the email feature, including sending spam or unsolicited emails, may result in immediate 
                  account termination.
                </p>
              </LegalSection>

              <LegalSection id="responsibilities" title="User Responsibilities">
                <p>As a user of Postify, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and truthful information in your CV and applications</li>
                  <li>Review all AI-generated content before sending to employers</li>
                  <li>Use the Service only for lawful job application purposes</li>
                  <li>Not attempt to circumvent usage limits or security measures</li>
                  <li>Not upload malicious files or content that violates others&apos; rights</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                </ul>
              </LegalSection>

              <LegalSection id="ip" title="Intellectual Property">
                <p>
                  <strong>Your Content:</strong> You retain all rights to your CV, job descriptions, and personal information. 
                  By using the Service, you grant Postify a limited license to process this content for providing the Service.
                </p>
                <p>
                  <strong>AI-Generated Content:</strong> Cover letters generated by Postify&apos;s AI are provided to you for 
                  your use. You may edit, modify, and use them as you see fit for job applications.
                </p>
                <p>
                  <strong>Postify Platform:</strong> All rights, title, and interest in the Postify platform, including 
                  software, design, trademarks, and documentation, remain the exclusive property of Postify.
                </p>
              </LegalSection>

              <LegalSection id="liability" title="Limitation of Liability">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Postify is provided &quot;AS IS&quot; without warranties of any kind</li>
                  <li>We do not guarantee uninterrupted, error-free, or secure service</li>
                  <li>We are not liable for any job application outcomes or employment decisions</li>
                  <li>We are not responsible for AI-generated content accuracy or appropriateness</li>
                  <li>Our total liability shall not exceed the amount you paid for the Service (if any)</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                </ul>
                <p>
                  Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you.
                </p>
              </LegalSection>

              <LegalSection id="changes" title="Changes to Terms">
                <p>
                  Postify reserves the right to modify these Terms & Conditions at any time. We will notify users of 
                  material changes via email or through the Service.
                </p>
                <p>
                  Your continued use of the Service after changes are posted constitutes acceptance of the modified terms. 
                  If you do not agree to the changes, you must stop using the Service.
                </p>
              </LegalSection>

              <LegalSection id="contact" title="Contact Information">
                <p>
                  If you have questions about these Terms & Conditions, please contact us at:
                </p>
                <p className="font-semibold">
                  Email: legal@postify.app
                </p>
                <p>
                  For privacy-related inquiries, please see our{" "}
                  <Link href="/privacy" className="text-[#7C9EE8] hover:underline font-semibold">
                    Privacy Policy
                  </Link>.
                </p>
              </LegalSection>
            </div>

            <div className="mt-12 p-6 bg-white rounded-2xl border border-[#EAE7E3]">
              <p className="text-sm text-[#78716C]">
                By using Postify, you acknowledge that you have read, understood, and agree to be bound by these 
                Terms & Conditions and our{" "}
                <Link href="/privacy" className="text-[#7C9EE8] hover:underline font-semibold">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents items={sections} />
            </div>
          </aside>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
