// components/Footer.jsx
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Buy</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Registration
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Seasonal Sales and events
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Subcription
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Sell</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Start publicing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Affiliates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay connected</h3>
            <div className="flex space-x-3">
              <Link href="#" className="text-blue-600 hover:text-blue-800">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-blue-600 hover:text-blue-800">
                <Twitter size={20} />
                <span className="sr-only">X (Twitter)</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About NextBook</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Company info
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  News
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Advertise with us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Policies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Help & Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Seller Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Money Back Guarantee
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  Announcements
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  eBay Community
                </Link>
              </li>
              <li>
                <Link href="#" className="text-blue-600 hover:underline">
                  eBay for Business Podcast
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-xs text-gray-600 space-y-2">
            <p>
              Copyright © 2025 NextBook Inc. All Rights Reserved.{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Accessibility
              </Link>
              ,{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                User Agreement
              </Link>
              ,{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Privacy
              </Link>
              , ,{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Payments Terms of Use
              </Link>
              ,{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Cookies
              </Link>
              ,{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                Your Privacy Choices
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-blue-600 hover:underline">
                AdChoice
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
