"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const NBSP = " ";

interface RevealTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  staggerStep?: number;
}

interface RevealCharProps {
  char: string;
  index: number;
  staggerStep: number;
  animate: boolean;
}

// `indent-0` matters: a caller's text-indent would otherwise inherit into every
// inline-block span and be re-applied per character.
function RevealChar({ char, index, staggerStep, animate }: RevealCharProps) {
  if (!animate) {
    return <span className="inline-block indent-0">{char}</span>;
  }

  return (
    <motion.span
      className="inline-block indent-0"
      initial={{ opacity: 0.001, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * staggerStep }}
    >
      {char}
    </motion.span>
  );
}

export function RevealText({
  text,
  className,
  as: Tag = "h2",
  staggerStep = 0.012,
}: RevealTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const animate = !prefersReducedMotion;
  const words = text.split(" ");

  // Precompute each word's first character index (spaces counted) so the stagger runs
  // continuously across the whole string without mutating state during render.
  const wordStarts: number[] = [];
  words.reduce((acc, word) => {
    wordStarts.push(acc);
    return acc + Array.from(word).length + 1;
  }, 0);

  return (
    <Tag className={cn(className)}>
      {words.map((word, wordIndex) => {
        const chars = Array.from(word);
        const wordStart = wordStarts[wordIndex];
        const spaceIndex = wordStart + chars.length;
        const isLastWord = wordIndex === words.length - 1;

        return (
          <Fragment key={`${wordIndex}-${word}`}>
            <span className="inline-block indent-0 whitespace-nowrap">
              {chars.map((char, i) => (
                <RevealChar
                  key={i}
                  char={char}
                  index={wordStart + i}
                  staggerStep={staggerStep}
                  animate={animate}
                />
              ))}
            </span>
            {isLastWord ? null : (
              <RevealChar
                char={NBSP}
                index={spaceIndex}
                staggerStep={staggerStep}
                animate={animate}
              />
            )}
          </Fragment>
        );
      })}
    </Tag>
  );
}
