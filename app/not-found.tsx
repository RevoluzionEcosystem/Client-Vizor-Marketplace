"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Home,
  ArrowLeft,
  Search,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // List of suggested pages
  const suggestedPages = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4" /> },
    { name: "Staking", path: "/staking", icon: <ChevronRight className="h-4 w-4" /> },
    { name: "Governance", path: "/governance", icon: <ChevronRight className="h-4 w-4" /> },
    { name: "Documentation", path: "/documentation", icon: <ChevronRight className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
      <motion.div 
        className="max-w-3xl w-full bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Top accent bar */}
        <div className="h-2 w-full bg-gradient-to-r from-accent-dark via-accent to-accent-light" />
        
        <div className="p-8 md:p-12">
          {/* Top section */}
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-slate-800"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 404 illustration */}
            <motion.div 
              className="w-40 h-40 relative flex-shrink-0"
              variants={itemVariants}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <AlertCircle className="w-24 h-24 text-accent opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-white">404</p>
                </div>
              </div>
            </motion.div>
            
            {/* Text content */}
            <motion.div variants={itemVariants} className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Page Not Found
              </h1>
              <p className="text-slate-300 text-lg mb-6">
                We couldn't find the page you're looking for. The page may have been moved,
                deleted, or never existed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => router.push("/")}
                  className="bg-accent hover:bg-accent-light text-slate-900 flex items-center gap-2"
                >
                  <Home className="h-4 w-4" /> 
                  Return Home
                  <span className="ml-1 opacity-75 text-xs">({countdown}s)</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="border-slate-700 text-slate-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Suggested pages */}
          <motion.div 
            className="pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-xl font-medium text-slate-200 mb-5">You might be looking for:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedPages.map((page, index) => (
                <Link 
                  href={page.path} 
                  key={index}
                  className="flex items-center p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-3">
                    {page.icon}
                  </div>
                  <span className="text-slate-200">{page.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
          
          {/* Search suggestion */}
          <motion.div 
            className="mt-8 p-6 rounded-xl bg-slate-800/30 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="text-center sm:text-left">
              <p className="text-slate-300 font-medium">Still can't find what you're looking for?</p>
              <p className="text-slate-400 text-sm mt-1">Try using the navigation or visit our documentation.</p>
            </div>
            <Button 
              className="bg-slate-700 hover:bg-slate-600 text-white whitespace-nowrap"
              onClick={() => router.push("/documentation")}
            >
              <Search className="h-4 w-4 mr-2" /> Visit Documentation
            </Button>
          </motion.div>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-900/80 p-4 text-center border-t border-slate-800">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Vizor | All rights reserved
          </p>
        </div>
      </motion.div>
    </div>
  );
}