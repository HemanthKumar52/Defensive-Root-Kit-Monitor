import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function StatsCard({ title, value, icon: Icon, trend, color = "primary" }) {
  const colorClasses = {
    primary: "text-primary border-primary/20 bg-primary/5",
    danger: "text-danger border-danger/20 bg-danger/5",
    accent: "text-accent border-accent/20 bg-accent/5",
    secondary: "text-secondary border-secondary/20 bg-secondary/5",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("glass-card p-6 flex items-center justify-between", colorClasses[color])}
    >
      <div>
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="text-3xl font-mono font-bold mt-2 text-white">{value}</div>
      </div>
      <div className={clsx("p-3 rounded-lg bg-white/5", colorClasses[color])}>
        <Icon size={24} />
      </div>
    </motion.div>
  );
}
