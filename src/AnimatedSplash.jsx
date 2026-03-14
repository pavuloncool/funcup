import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import confetti from "canvas-confetti"

import Fingerprint from "./assets/home-print.svg?react"
import Bean from "./assets/home-bean.svg?react"

export default function AnimatedSplash({ onFinish }) {

  const [stage, setStage] = useState("idle")

  const triggerBurst = () => {

    confetti({
      particleCount: 90,
      spread: 90,
      startVelocity: 35,
      gravity: 0.9,
      ticks: 120,
      origin: { y: 0.5 }
    })

    confetti({
      particleCount: 50,
      spread: 140,
      startVelocity: 25,
      scalar: 0.7,
      origin: { y: 0.5 }
    })
  }

  const handleTap = () => {

    if (stage !== "idle") return

    navigator.vibrate?.(14)

    setStage("press")

    // burst po kompresji
    setTimeout(() => {
      triggerBurst()
      setStage("burst")
    }, 220)

    // fingerprint zaczyna znikać
    setTimeout(() => {
      setStage("dissolve")
    }, 520)

    // pauza przed pojawieniem się bean
    setTimeout(() => {
      setStage("bean")
    }, 1100)

    // bean fade-out
    setTimeout(() => {
      setStage("fadeBean")
    }, 2600)

    // wejście aplikacji
    setTimeout(() => {
      onFinish()
    }, 3200)
  }

  return (

    <div className="w-screen h-screen bg-white flex items-center justify-center will-change-transform">

      <AnimatePresence mode="wait">

        {(stage === "idle" || stage === "press" || stage === "burst" || stage === "dissolve") && (

          <motion.div
            key="fingerprint"
            onClick={handleTap}

            initial={{ opacity: 0, scale: 0.8 }}

            animate={
              stage === "idle"
                ? { opacity: 1, scale: [1, 1.05, 1] }

                : stage === "press"
                ? { scale: 0.85 }

                : stage === "burst"
                ? { scale: 0.75 }

                : { scale: 0.1, opacity: 0 }
            }

            transition={
              stage === "idle"
                ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }

                : stage === "press"
                ? { duration: 0.2, ease: "easeOut" }

                : stage === "burst"
                ? { duration: 0.3, ease: "easeOut" }

                : { duration: 0.5, ease: "easeOut" }
            }

            className="cursor-pointer w-32 h-32 flex items-center justify-center"
          >
            <Fingerprint />
          </motion.div>
        )}

        {(stage === "bean" || stage === "fadeBean") && (

          <motion.div
            key="bean"

            initial={{
              opacity: 0,
              scale: 0.55,
              rotate: -10,
              filter: "blur(8px)"
            }}

            animate={
              stage === "bean"
                ? {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    filter: "blur(0px)"
                  }
                : {
                    opacity: 0,
                    scale: 0.9
                  }
            }

            transition={
              stage === "bean"
                ? {
                    opacity: { duration: 1.8, ease: "easeOut" },
                    scale: { type: "spring", stiffness: 55, damping: 16 },
                    rotate: { duration: 1.6, ease: "easeOut" },
                    filter: { duration: 1.4 }
                  }
                : {
                    opacity: { duration: 0.6, ease: "easeInOut" },
                    scale: { duration: 0.6 }
                  }
            }

            className="w-32 h-32 flex items-center justify-center"
          >
            <Bean />
          </motion.div>

        )}

      </AnimatePresence>

    </div>
  )
}