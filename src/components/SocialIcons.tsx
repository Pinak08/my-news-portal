import { socialLinks } from "@/lib/social";

interface Props {
  className?: string;
  iconClassName?: string;
}

// Renders YouTube, Instagram, Facebook, and WhatsApp icons in their official
// brand colors (rather than a plain single color) so they're instantly
// recognizable and stand out against the dark header/footer background.
export default function SocialIcons({ className = "", iconClassName = "w-7 h-7" }: Props) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href={socialLinks.youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube પર TV10 Gujarat"
        title="YouTube"
        className="hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" className={iconClassName}>
          <path
            fill="#FF0000"
            d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8Z"
          />
          <path fill="#FFFFFF" d="M9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
        </svg>
      </a>
      <a
        href={socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram પર TV10 Gujarat"
        title="Instagram"
        className="hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" className={iconClassName}>
          <defs>
            <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FEDA75" />
              <stop offset="25%" stopColor="#FA7E1E" />
              <stop offset="50%" stopColor="#D62976" />
              <stop offset="75%" stopColor="#962FBF" />
              <stop offset="100%" stopColor="#4F5BD5" />
            </linearGradient>
          </defs>
          <path
            fill="url(#ig-gradient)"
            d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2.4.3 3.3 1.2.9.9 1.14 2 1.2 3.3.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.3 2.4-1.2 3.3-.9.9-2 1.14-3.3 1.2-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-2.4-.3-3.3-1.2-.9-.9-1.14-2-1.2-3.3C2.53 15.6 2.53 15.2 2.53 12s0-3.6.07-4.9c.06-1.2.3-2.4 1.2-3.3.9-.9 2-1.14 3.3-1.2C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5 0-4.75.07-1 .05-1.5.22-1.86.36-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.36-.3.86-.36 1.86C3.02 8.5 3 8.86 3 12s0 3.5.07 4.75c.05 1 .22 1.5.36 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.36.14.86.3 1.86.36 1.25.06 1.6.07 4.75.07s3.5 0 4.75-.07c1-.05 1.5-.22 1.86-.36.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.36.3-.86.36-1.86.06-1.25.07-1.6.07-4.75s0-3.5-.07-4.75c-.05-1-.22-1.5-.36-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.36-.14-.86-.3-1.86-.36C15.5 4 15.14 4 12 4Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
          />
        </svg>
      </a>
      <a
        href={socialLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook પર TV10 Gujarat"
        title="Facebook"
        className="hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" className={iconClassName}>
          <path
            fill="#1877F2"
            d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.16 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.78 8.44-4.94 8.44-9.94Z"
          />
        </svg>
      </a>
      <a
        href={socialLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ચેનલ પર TV10 Gujarat"
        title="WhatsApp Channel"
        className="hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" className={iconClassName}>
          <path
            fill="#25D366"
            d="M17.5 14.4c-.3-.15-1.7-.85-2-.94-.27-.1-.46-.15-.66.15-.2.3-.75.94-.92 1.13-.17.2-.34.22-.63.08-.3-.15-1.24-.46-2.37-1.47-.87-.78-1.47-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.14.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.66-1.6-.9-2.18-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.5.08-.77.38-.27.3-1 1-1 2.44 0 1.43 1.03 2.82 1.17 3.02.15.2 2.04 3.1 4.94 4.36.7.3 1.24.48 1.66.61.7.22 1.33.19 1.84.11.56-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.13-.26-.2-.56-.35ZM12.02 2C6.5 2 2 6.48 2 12c0 1.9.53 3.68 1.44 5.2L2 22l4.94-1.4A9.94 9.94 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.13c-1.72 0-3.32-.5-4.66-1.36l-.33-.2-2.93.83.85-2.85-.22-.34a8.13 8.13 0 0 1-1.24-4.21c0-4.5 3.66-8.16 8.53-8.16 4.87 0 8.53 3.66 8.53 8.16s-3.66 8.13-8.53 8.13Z"
          />
        </svg>
      </a>
    </div>
  );
}
