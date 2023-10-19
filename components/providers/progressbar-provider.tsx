"use client"

import { Next13ProgressBar } from 'next13-progressbar';

const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Next13ProgressBar options={{ showSpinner: false }} color="#6366f1" />
      {children}
    </>
  )
}
export default ProgressBarProvider