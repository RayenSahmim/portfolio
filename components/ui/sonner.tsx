"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        className: "toast-custom",
        style: {
          background: theme === "dark" 
            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))" 
            : "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))",
          border: theme === "dark" 
            ? "1px solid rgba(99, 102, 241, 0.3)" 
            : "1px solid rgba(99, 102, 241, 0.2)",
          color: theme === "dark" 
            ? "rgba(255, 255, 255, 0.9)" 
            : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: "12px",
          boxShadow: theme === "dark"
            ? "0 8px 32px rgba(99, 102, 241, 0.2), 0 0 20px rgba(139, 92, 246, 0.1)"
            : "0 8px 32px rgba(99, 102, 241, 0.15), 0 0 20px rgba(139, 92, 246, 0.1)",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
