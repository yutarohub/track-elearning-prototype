import Image from "next/image";
import { ImageIcon } from "lucide-react";

export type OpenBadgeImageSize = "card" | "thumb" | "modal";

export function OpenBadgeImage({
  imageSrc,
  size = "card",
  className = "",
}: {
  imageSrc?: string;
  size?: OpenBadgeImageSize;
  className?: string;
}) {
  const px = size === "card" ? 128 : size === "modal" ? 96 : 48;
  const wrap =
    size === "card" ? "h-32 w-32 p-2" : size === "modal" ? "h-28 w-28 p-2" : "h-12 w-12 p-1";

  if (imageSrc) {
    return (
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-2xl bg-slate-50/90 ring-1 ring-slate-200/90 shadow-inner ${wrap} ${className}`}
      >
        <Image
          src={imageSrc}
          alt=""
          width={px}
          height={px}
          className="object-contain"
          priority={size === "card"}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-dashed ring-slate-300 ${wrap} ${className}`}
    >
      <ImageIcon className={size === "thumb" ? "h-5 w-5 text-slate-400" : "h-10 w-10 text-slate-400"} />
    </div>
  );
}
