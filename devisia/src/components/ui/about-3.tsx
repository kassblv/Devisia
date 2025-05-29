import { Button } from "@/components/ui/button";
import ActionButton from "./action-button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

interface About3Props {
  title?: string;
  description?: string;
  mainImage?: {
    src: string;
    alt: string;
  };
  secondaryImage?: {
    src: string;
    alt: string;
  };
  breakout?: {
    src: string;
    alt: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  companiesTitle?: string;
  companies?: Array<{
    src: string;
    alt: string;
  }>;
  achievementsTitle?: string;
  achievementsDescription?: string;
  achievements?: Array<{
    label: string;
    value: string;
  }>;
}


const defaultAchievements = [
  { label: "Companies Supported", value: "300+" },
  { label: "Projects Finalized", value: "800+" },
  { label: "Happy Customers", value: "99%" },
  { label: "Recognized Awards", value: "10+" },
];

export const About3 = ({
  mainImage = {
    src: "https://shadcnblocks.com/images/block/placeholder-1.svg",
    alt: "placeholder",
  },
  secondaryImage = {
    src: "https://shadcnblocks.com/images/block/placeholder-2.svg",
    alt: "placeholder",
  },
  breakout = {
    src: "https://shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
    title: "Hundreds of blocks at Shadcnblocks.com",
    description:
      "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
    buttonText: "Discover more",
    buttonUrl: "https://shadcnblocks.com",
  },

  achievementsTitle = "Our Achievements in Numbers",
  achievementsDescription = "Providing businesses with effective tools to improve workflows, boost efficiency, and encourage growth.",
  achievements = defaultAchievements,
}: About3Props = {}) => {
  return (
    <section className="py-32" id="about">
      <div className="container mx-auto">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
            Fonctionnalités conçues pour accélérer votre succès
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez les outils qui vous permettront de créer des devis professionnels en quelques minutes et d'augmenter vos taux de conversion.
          </p>
        </div>
        <div className="grid gap-7 lg:grid-cols-3 mb-20">
          <div className="lg:col-span-2 flex">
       {/* <img src={mainImage.src} alt={mainImage.alt} className="size-full max-h-[620px] rounded-xl object-cover lg:col-span-2" /> */}
            <HeroVideoDialog
              className="size-full max-h-[790px] rounded-xl object-cover lg:col-span-2"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc={mainImage.src}
              thumbnailAlt={mainImage.alt}
            />
          </div>
          <div className="flex flex-col gap-7 md:flex-row lg:flex-col">
            <div className="flex flex-col justify-between gap-6 rounded-xl bg-muted/80 backdrop-blur-sm p-7 md:w-1/2 lg:w-auto">
              <img
                src={breakout.src}
                alt={breakout.alt}
                className="mr-auto h-12"
              />
              <div>
                <p className="mb-2 text-lg font-semibold">{breakout.title}</p>
                <p className="text-muted-foreground">{breakout.description}</p>
              </div>
              <ActionButton label={breakout.buttonText!} href={breakout.buttonUrl!} className="mr-auto" />
            </div>
            {/* <img
              src={secondaryImage.src}
              alt={secondaryImage.alt}
              className="g"
            /> */}
            <div className="overflow-hidden"> 
                <HeroVideoDialog
              className="grow basis-0 rounded-xl object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc={secondaryImage.src}
              thumbnailAlt={secondaryImage.alt}
            />
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden rounded-xl bg-muted/80 backdrop-blur-sm     p-10 md:p-16">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <h2 className="text-4xl font-semibold">{achievementsTitle}</h2>
            <p className="max-w-screen-sm text-muted-foreground">
              {achievementsDescription}
            </p>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-10 text-center">
            {achievements.map((item, idx) => (
              <div className="flex flex-col gap-4" key={item.label + idx}>
                <p>{item.label}</p>
                <span className="text-4xl font-semibold md:text-5xl">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute -top-1 right-1 z-10 hidden h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted-foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground))_1px,transparent_1px)] bg-[size:80px_80px] opacity-15 [mask-image:linear-gradient(to_bottom_right,#000,transparent,transparent)] md:block"></div>
        </div>
      </div>
    </section>
  );
};
