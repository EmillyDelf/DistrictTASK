import Image from "next/image";

import logoDark from "../../../public/brand/logo-dark.png";
import logoLight from "../../../public/brand/logo-light.png";
import { cn } from "@/lib/utils";

const sizes = {
  sm: { className: "h-10", width: "80px" },
  md: { className: "h-10 sm:h-12", width: "(min-width: 640px) 96px, 80px" },
  lg: { className: "h-16", width: "128px" },
};

type BrandLogoProps = {
  size?: keyof typeof sizes;
  alt?: string;
  className?: string;
};

export function BrandLogo({ size = "md", alt = "District Task", className }: BrandLogoProps) {
  const dimensions = sizes[size];
  const imageClass = cn("w-auto object-contain", dimensions.className);

  return (
    <span className={cn("inline-flex shrink-0", className)}>
      <Image src={logoLight} alt={alt} sizes={dimensions.width} loading="eager" className={cn(imageClass, "block dark:hidden")} />
      <Image src={logoDark} alt={alt} sizes={dimensions.width} loading="eager" className={cn(imageClass, "hidden dark:block dark:scale-[1.08]")} />
    </span>
  );
}
