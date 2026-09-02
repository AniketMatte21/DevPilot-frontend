import { cn } from "@/lib/utils";

const DevPilotIcon = ({ className }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "h-11 w-11 sm:h-12 sm:w-12",
        "rounded-xl",
        "border border-border",
        "bg-background",
        "shadow-sm",
        className
      )}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-8 w-8 sm:h-9 sm:w-9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="devpilot-gradient"
            x1="8"
            y1="40"
            x2="40"
            y2="8"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Star */}
        <path
          d="M11 6L12.5 10L16.5 11.5L12.5 13L11 17L9.5 13L5.5 11.5L9.5 10L11 6Z"
          fill="url(#devpilot-gradient)"
        />

        {/* Paper plane */}
        <path
          d="M39.5 8L8 24.5L21.5 28L26 40L39.5 8Z"
          fill="url(#devpilot-gradient)"
        />

        {/* Plane inner cut */}
        <path
          d="M21.5 28L29.5 20L26 40L21.5 28Z"
          className="fill-background"
        />

        {/* Motion trail */}
        <path
          d="M7 39C13 36 18 32 22 27"
          stroke="url(#devpilot-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

const DevPilotLogo = ({
  className,
  iconClassName,
  showIcon = true,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 select-none",
        className
      )}
    >
      {showIcon && <DevPilotIcon className={iconClassName} />}

      <span className="text-2xl sm:text-3xl font-bold tracking-tight">
        <span className="text-foreground">Dev</span>
        <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
          Pilot
        </span>
      </span>
    </div>
  );
};

export default DevPilotLogo;