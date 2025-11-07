import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Separator } from '../ui/separator';
import { APP_NAME, APP_SHORT_NAME, CONTACT_INFO, SOCIAL_LINKS } from '../../constants/app';
import { ROUTES } from '../../constants/routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <span className="font-semibold text-secondary-foreground">AYP</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold leading-tight">African Yellow Pages</span>
                <span className="text-xs text-muted-foreground">USA</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              The premier directory for African businesses across the United States. 
              Connect, grow, and thrive in the African-American business community.
            </p>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to={ROUTES.FIND_LISTINGS} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Find Listings
                </Link>
              </li>
              <li>
                <Link to={ROUTES.EVENTS} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Events
                </Link>
              </li>
              <li>
                <Link to={ROUTES.BLOGS} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Blogs
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRICING} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${CONTACT_INFO.EMAIL}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CONTACT_INFO.EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${CONTACT_INFO.PHONE.replace(/\D/g, '')}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {CONTACT_INFO.PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {CONTACT_INFO.ADDRESS}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 pb-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
