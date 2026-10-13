import type { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AuthCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Helmet>
      <title>{title} | Design Bakery</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <Navbar />
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 md:p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-primary text-center mb-6">{title}</h1>
        {children}
      </div>
    </main>
    <Footer />
  </div>
);

export default AuthCard;
