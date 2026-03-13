import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-black py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-zinc-500 text-sm">
            &copy; {currentYear} ABSTRACT. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-zinc-400">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <Link href="#services" className="transition-colors hover:text-white">
              Services
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </Link>
          </div>

          <div className="flex items-center space-x-6 text-sm text-zinc-500">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
