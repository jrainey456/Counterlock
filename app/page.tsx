"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlug } from "@/lib/hero-slug";

const heroesApiUrl = "https://api.deadlock-api.com/v1/assets/heroes?only_active=true";

type HeroAsset = {
    name: string;
    images?: {
        background_image_webp?: string;
        background_image?: string;
    };
};

const heroes = [
    "Abrams",
    "Apollo",
    "Bebop",
    "Billy",
    "Calico",
    "Celeste",
    "Drifter",
    "Dynamo",
    "Graves",
    "Grey Talon",
    "Haze",
    "Holliday",
    "Infernus",
    "Ivy",
    "Kelvin",
    "Lady Geist",
    "Lash",
    "McGinnis",
    "Mina",
    "Mirage",
    "Mo & Krill",
    "Paige",
    "Paradox",
    "Pocket",
    "Rem",
    "Seven",
    "Shiv",
    "Silver",
    "Sinclair",
    "The Doorman",
    "Venator",
    "Victor",
    "Vindicta",
    "Viscous",
    "Vyper",
    "Warden",
    "Wraith",
    "Yamato",
];

const heroImages: Record<string, string> = {
    Abrams: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/bull_card.webp",
    Apollo: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/fencer_card.webp",
    Bebop: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/bebop_card.webp",
    Billy: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/punkgoat_card.webp",
    Calico: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/nano_card.webp",
    Celeste: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/unicorn_card.webp",
    Drifter: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/drifter_card.webp",
    Dynamo: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/sumo_card.webp",
    Graves: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/necro_card.webp",
    "Grey Talon": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/archer_card.webp",
    Haze: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/haze_card.webp",
    Holliday: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/astro_card.webp",
    Infernus: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/inferno_card.webp",
    Ivy: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/tengu_card.webp",
    Kelvin: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/kelvin_card.webp",
    "Lady Geist": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/spectre_card.webp",
    Lash: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/lash_card.webp",
    McGinnis: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/engineer_card.webp",
    Mina: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/vampirebat_card.webp",
    Mirage: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/mirage_card.webp",
    "Mo & Krill": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/digger_card.webp",
    Paige: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/bookworm_card.webp",
    Paradox: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/chrono_card.webp",
    Pocket: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/synth_card.webp",
    Rem: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/familiar_card.webp",
    Seven: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/gigawatt_card.webp",
    Shiv: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/shiv_card.webp",
    Silver: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/werewolf_card.webp",
    Sinclair: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/magician_card.webp",
    "The Doorman": "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/doorman_card.webp",
    Venator: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/priest_card.webp",
    Victor: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/frank_card.webp",
    Vindicta: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/hornet_card.webp",
    Viscous: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/viscous_card.webp",
    Vyper: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/kali_card.webp",
    Warden: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/warden_card.webp",
    Wraith: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/wraith_card.webp",
    Yamato: "https://assets-bucket.deadlock-api.com/assets-api-res/images/heroes/yamato_card.webp",
};

export default function Home() {
    const [heroBanners, setHeroBanners] = useState<Record<string, string>>({});

    useEffect(() => {
        const controller = new AbortController();

        async function loadHeroBanners() {
            try {
                const response = await fetch(heroesApiUrl, { signal: controller.signal });
                if (!response.ok) {
                    return;
                }

                const roster = (await response.json()) as HeroAsset[];
                const banners = Object.fromEntries(
                    roster.flatMap((hero) => {
                        const banner =
                            hero.images?.background_image_webp ??
                            hero.images?.background_image;
                        return banner ? [[heroSlug(hero.name), banner]] : [];
                    }),
                );
                setHeroBanners(banners);
            } catch {
                return;
            }
        }

        void loadHeroBanners();
        return () => controller.abort();
    }, []);

    return (
        <main className="min-h-screen bg-[#090a08] text-[#f1f0e8]">
            <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
                <header className="mb-10 border-b border-[#34362e] pb-7">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center bg-[#c9df69] font-serif text-xl font-bold text-[#17190f]">
                                C
                            </span>
                            <span className="font-mono text-xs font-semibold tracking-[0.16em] text-[#d7d6cc]">
                                COUNTERLOCK
                            </span>
                        </div>
                        <p className="font-mono text-[11px] tracking-[0.12em] text-[#a4a497]">
                            {heroes.length} PLAYABLE HEROES
                        </p>
                    </div>

                    <div className="mt-9 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                        <div>
                            <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-[#c9df69]">
                                DEADLOCK / HERO INDEX
                            </p>
                            <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
                                The roster
                            </h1>
                        </div>
                        <p className="pb-1 font-mono text-[10px] tracking-[0.12em] text-[#77796f]">
                            ALPHABETICAL
                        </p>
                    </div>
                </header>

                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {heroes.map((hero, index) => (
                        <li key={hero}>
                            <Link
                                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9df69]"
                                href={`/heroes/${heroSlug(hero)}`}
                            >
                                <article className="overflow-hidden border border-[#303229] bg-[#11120f] transition-colors duration-200 group-hover:border-[#c9df69]">
                                    <div className="relative aspect-[14/19] border-b border-[#303229] bg-[#11120f]">
                                        {heroBanners[heroSlug(hero)] && (
                                            <Image
                                                alt=""
                                                aria-hidden="true"
                                                className="object-cover object-center opacity-50 transition-opacity duration-300 group-hover:opacity-70"
                                                fill
                                                sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, (max-width: 1280px) 18vw, 15vw"
                                                src={heroBanners[heroSlug(hero)]}
                                            />
                                        )}
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#11120f]/75 via-[#11120f]/25 to-[#11120f]/20" />
                                        <Image
                                            alt={`${hero} portrait`}
                                            className="portrait-keyline z-20 object-contain object-center"
                                            fill
                                            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, (max-width: 1280px) 18vw, 15vw"
                                            src={heroImages[hero]}
                                        />
                                        <span className="absolute bottom-3 right-3 z-30 font-mono text-[10px] tracking-[0.12em] text-[#d7d6cc]">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <div className="flex min-h-16 items-center gap-3 px-3 py-3 sm:px-4">
                                        <span className="font-mono text-[10px] text-[#c9df69]">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <h2 className="text-sm font-medium leading-tight text-[#e7e6dc] sm:text-base">
                                            {hero}
                                        </h2>
                                    </div>
                                </article>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}