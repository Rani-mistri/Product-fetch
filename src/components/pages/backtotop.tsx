"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "../ui/button";

export function BackToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <Button
      className="fixed bottom-6 right-6 bg-black/50 text-white px-5 py-8 rounded-full text-[12px] flex flex-col"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    >
        <span ><FaArrowUp size={12} className="text-[80px]" /></span>
     Top
    </Button> 
  );
}