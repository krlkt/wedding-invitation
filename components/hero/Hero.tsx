import Image from 'next/image';

import './hero.css';
import { motion } from 'framer-motion';

import { useWeddingData } from '@/hooks/useWeddingData';

import { useEffect, useState } from 'react';

const Hero = () => {
  const { config, startingSection } = useWeddingData();

  // Use display names from starting section, fallback to basic names from config
  const groomDisplayName = startingSection?.groomDisplayName || config.groomName;
  const brideDisplayName = startingSection?.brideDisplayName || config.brideName;

  // Show wedding date if enabled in starting section (default true)
  const showWeddingDate = startingSection?.showWeddingDate !== false;

  // Format wedding date
  const formattedDate = new Date(config.weddingDate).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Show parent info if enabled
  const showParentInfo = startingSection?.showParentInfo === true;
  const hasGroomParents = startingSection?.groomFatherName || startingSection?.groomMotherName;
  const hasBrideParents = startingSection?.brideFatherName || startingSection?.brideMotherName;

  // Dynamic text sizing based on name length - use smallest size for both names
  const getNameTextSizePriority = (name: string): number => {
    const length = name.length;
    if (length <= 12) return 4; // text-5xl
    if (length <= 18) return 3; // text-4xl
    if (length <= 25) return 2; // text-3xl
    return 1; // text-2xl
  };

  const groomPriority = getNameTextSizePriority(groomDisplayName);
  const bridePriority = getNameTextSizePriority(brideDisplayName);

  // Use the smaller size (lower priority number) for both names
  const textSizePriority = Math.min(groomPriority, bridePriority);

  const getTextSizeClass = (priority: number): string => {
    if (priority >= 4) return 'text-5xl';
    if (priority >= 3) return 'text-4xl';
    if (priority >= 2) return 'text-3xl';
    return 'text-2xl';
  };

  const nameTextSize = getTextSizeClass(textSizePriority);

  return (
    <div className="hero-background flex h-full w-full grow flex-col items-center justify-center text-center">
      <div className="inner-wrapper relative flex max-w-[600px] flex-col items-center gap-4 px-[25%] py-[15%]">
        <div id="monogram" className="relative h-28 w-28">
          <Image
            src={config.monogramFilename ?? '/images/monogram/monogram.webp'}
            alt={`${groomDisplayName} & ${brideDisplayName} Monogram`}
            fill
            className="object-contain"
            priority
            fetchPriority="high"
          />
        </div>
        <div id="hero-text" className="z-10 flex flex-col gap-4 font-heading text-black">
          <p className="text-lg">The Wedding of</p>
          <div>
            <p className={`font-cursive2 ${nameTextSize} break-words px-2`}>{groomDisplayName}</p>
            {showParentInfo && hasGroomParents && (
              <div className="mt-2 text-sm">
                <p className="text-xs opacity-70">Son of</p>
                {startingSection?.groomFatherName && <p>{startingSection.groomFatherName}</p>}
                {startingSection?.groomMotherName && <p>{startingSection.groomMotherName}</p>}
              </div>
            )}
            <p className="font-cursive2 text-5xl">&</p>
            <p className={`font-cursive2 ${nameTextSize} break-words px-2`}>{brideDisplayName}</p>
            {showParentInfo && hasBrideParents && (
              <div className="mt-2 text-sm">
                <p className="text-xs opacity-70">Daughter of</p>
                {startingSection?.brideFatherName && <p>{startingSection.brideFatherName}</p>}
                {startingSection?.brideMotherName && <p>{startingSection.brideMotherName}</p>}
              </div>
            )}
          </div>
          {showWeddingDate && <p className="text-lg">{formattedDate}</p>}
        </div>
      </div>
      <ScrollDownText />
    </div>
  );
};

export default Hero;

const ScrollDownText = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return showPrompt ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0.8, 1], y: [5, 0, 5] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
      className="absolute bottom-10 flex justify-center text-sm text-secondary-main"
    >
      ↓ Scroll Down ↓
    </motion.div>
  ) : null;
};
