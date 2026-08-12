import {
  ensureGsap,
  prefersReducedMotion,
} from "@/components/motion/gsap-setup";

type TweenTarget = string | Element | Element[] | NodeListOf<Element>;

export function idleFloat(
  targets: TweenTarget,
  options: { y?: number; duration?: number; delay?: number } = {},
): ReturnType<ReturnType<typeof ensureGsap>["to"]> | null {
  if (prefersReducedMotion()) return null;

  const gsapInstance = ensureGsap();
  const { y = 8, duration = 3.2, delay = 0 } = options;

  return gsapInstance.to(targets, {
    y: `+=${y}`,
    duration,
    delay,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
