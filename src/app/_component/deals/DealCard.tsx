"use client";

import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { DealCardProps } from "@/app/_types";

export default function DealCard({ variant, badge, title, description, discount, code, codeLabel, buttonLabel }: DealCardProps) {
  return <article className={`deal-card ${variant}`}><span className="deal-pill">{badge}</span><h2>{title}</h2><p>{description}</p><div className="deal-discount"><strong>{discount}</strong><span>{codeLabel} <b>{code}</b></span></div><Button onClick={() => document.getElementById("featured-products")?.scrollIntoView({ behavior: "smooth" })}>{buttonLabel}<FiArrowRight /></Button></article>;
}
