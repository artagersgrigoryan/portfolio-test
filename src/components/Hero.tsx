import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    }
}

export const Hero = () => {
  return (
    <section 
      className="relative min-h-[calc(100vh-89px)] flex items-center justify-center text-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/profile.jpg')" }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
      
      <motion.div
        className="relative z-20 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
          variants={itemVariants}
        >
          Artagers Grigoryan
          <br />
          <span className="text-primary">Digital Product Designer & Developer</span>
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          variants={itemVariants}
        >
          I design and code beautifully simple things, and I love what I do.
        </motion.p>
        <motion.div
          className="flex justify-center gap-4"
          variants={buttonVariants}
        >
          <a href="#projects">
            <Button size="lg">
              View My Work
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <ArrowDown className="ml-2 h-5 w-5" />
              </motion.div>
            </Button>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};