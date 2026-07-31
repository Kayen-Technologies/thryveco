import Image from "next/image";

import type { StudioMediaSrc } from "@/components/studio/defaults";

type StudioServiceStackProps = Readonly<{
  images: StudioMediaSrc[];
  className?: string;
}>;

export default function StudioServiceStack({ images, className = "" }: StudioServiceStackProps) {
  const layers = images.slice(0, 4);

  return (
    <div
      className={`studio-services__stack ${className}`.trim()}
      aria-hidden="true"
      data-reveal
    >
      {layers.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={`studio-services__stack-layer studio-services__stack-layer--${index + 1}`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 767px) 80vw, 418px"
            className="studio-services__stack-image"
          />
        </div>
      ))}
    </div>
  );
}
