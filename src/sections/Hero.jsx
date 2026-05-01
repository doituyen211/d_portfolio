'use client'

import ScrollCta from "@/components/ScrollCta";
import FadeInText from "@/components/FadeInText";

export default function HeroSection() {
    return (
        <div>
            <FadeInText tag="h1" className="text-5xl md:text-7xl tracking-widest text-white mb-6" startDelay={4200}>
                Vision must replace experience
            </FadeInText>
            <ScrollCta />
        </div>
    );
}