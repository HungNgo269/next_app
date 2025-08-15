// components/Footer.jsx
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Disc } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NextBook</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Your gateway to unlimited reading adventures.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://discord.com"
                aria-label="Discord"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Image
                  src={"/discord.png"}
                  alt="discord"
                  width={20}
                  height={20}
                ></Image>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Library</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Free Books
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Book Clubs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Author Events
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Reading Challenges
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 NextBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
