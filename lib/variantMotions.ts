export const variants = {
  onFadeEnter: {
    opacity: 0
  },
  fadeAnimate: {
    opacity: 1
  },
  onFadeExit: {
    opacity: 0
  },
  onEnter: { opacity: 0, x: 50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
    },
  }),
  hidden: { opacity: 0, x: 50 },
}