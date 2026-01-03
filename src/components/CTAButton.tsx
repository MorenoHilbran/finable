"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface CTAButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function CTAButton({ className, style }: CTAButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Link 
      href={isLoggedIn ? "/dashboard" : "/login"} 
      className={className}
      style={style}
    >
      <span></span>
      {isLoggedIn ? "Ke Dashboard" : "Mulai Belajar Sekarang"}
    </Link>
  );
}

