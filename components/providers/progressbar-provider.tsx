"use client"

import NextProgress from "next-progress";

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NextProgress delay={300} options={{ showSpinner: false }} />
      {children}
    </>
  )
}
export default ProgressBarProvider