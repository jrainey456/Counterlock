"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import counterItems from "@/data/counter-items.json";
import { heroSlug } from "@/lib/hero-slug";

const heroesApiUrl = "https://api.deadlock-api.com/v1/assets/heroes?only_active=true";
const itemsApiUrl = "https://api.deadlock-api.com/v1/assets/items?language=english";
const selectionAssetNames: Record<string, string> = {
    "Mo & Krill": "Mo Krill",
    "The Doorman": "Doorman",
};

const itemIconAliases: Record<string, string> = {
    curse: "cursed relic",
    "high-velocity mag": "high-velocity rounds",
    "improved bullet armor": "bullet armor",
    "improved spirit armor": "spirit armor",
    "silence glyph": "silence wave",
    "superior stamina": "stamina mastery",
};

type HeroAsset = {
    name: string;
    hero_type?: string;
};

type ItemAsset = {
    name: string;
    shop_image_webp?: string;
};

type HeroState =
    | { status: "loading" }
    | { status: "error" }
    | { status: "not-found" }
    | { status: "ready"; hero: HeroAsset };

export default function HeroDetail({ slug }: { slug: string }) {
    const [state, setState] = useState<HeroState>({ status: "loading" });
    const [itemImages, setItemImages] = useState<Record<string, string>>({});

    useEffect(() => {
        const controller = new AbortController();

        async function loadHero() {
            try {
                const response = await fetch(heroesApiUrl, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Hero API returned ${response.status}`);
                }

                const roster = (await response.json()) as HeroAsset[];
                const hero = roster.find((entry) => heroSlug(entry.name) === slug);
                setState(hero ? { status: "ready", hero } : { status: "not-found" });
            } catch {
                if (!controller.signal.aborted) {
                    setState({ status: "error" });
                }
            }

            try {
                const response = await fetch(itemsApiUrl, { signal: controller.signal });
                if (!response.ok) {
                    return;
                }

                const catalog = (await response.json()) as ItemAsset[];
                const images = Object.fromEntries(
                    catalog.flatMap((item) =>
                        item.shop_image_webp
                            ? [[item.name.toLowerCase(), item.shop_image_webp]]
                            : [],
                    ),
                );
                setItemImages(images);
            } catch {
                if (!controller.signal.aborted) {
                    setItemImages({});
                }
            }
        }

        void loadHero();
        return () => controller.abort();
    }, [slug]);

    if (state.status !== "ready") {
        const message =
            state.status === "loading"
                ? "Loading hero..."
                : state.status === "not-found"
                    ? "Hero not found."
                    : "Hero data is unavailable right now.";

        return (
            <main className="min-h-screen bg-[#090a08] px-5 py-8 text-[#f1f0e8] sm:px-8 lg:px-12">
                <div className="mx-auto max-w-[1200px]">
                    <Link className="font-mono text-xs text-[#c9df69] hover:underline" href="/">
                        Back to roster
                    </Link>
                    <p aria-live="polite" className="mt-12 font-serif text-3xl">
                        {message}
                    </p>
                </div>
            </main>
        );
    }

    const assetName = encodeURIComponent(
        selectionAssetNames[state.hero.name] ?? state.hero.name,
    );
    const selectionBackground = `https://assets.characterselectscreen.com/games/deadlock/backgrounds/${assetName}.png`;
    const selectionCharacter = `https://assets.characterselectscreen.com/games/deadlock/characters/${assetName}.png`;
    const heroCounterData = counterItems.hero_counters.find(
        (entry) => heroSlug(entry.hero) === slug,
    );
    const heroCounterItems = heroCounterData?.counter_items ?? [];

    return (
        <main className="min-h-screen bg-[#090a08] text-[#f1f0e8]">
            <section className="relative isolate flex aspect-video min-h-[360px] items-end overflow-hidden border-b border-[#34362e] md:aspect-[32/9] md:max-h-[560px] md:min-h-[240px]">
                <Image
                    alt=""
                    aria-hidden="true"
                    className="object-cover object-top"
                    fill
                    priority
                    sizes="100vw"
                    src={selectionBackground}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#090a08]/75 via-[#090a08]/20 to-[#090a08]/5" />
                <Image
                    alt=""
                    aria-hidden="true"
                    className="z-20 object-cover object-top drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
                    fill
                    priority
                    sizes="100vw"
                    src={selectionCharacter}
                />
                <div className="relative z-30 mx-auto flex w-full max-w-[1200px] items-end justify-between gap-3 px-5 pb-9 sm:px-8 sm:pb-12 lg:px-12">
                    <div className="relative z-30 min-w-0 flex-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        <Link className="font-mono text-xs text-[#c9df69] hover:underline" href="/">
                            Back to roster
                        </Link>
                        <p className="mb-2 mt-10 font-mono text-[10px] tracking-[0.18em] text-[#c9df69]">
                            {state.hero.hero_type?.replace(/_/g, " ").toUpperCase() ?? "DEADLOCK HERO"}
                        </p>
                        <h1 className="font-serif text-4xl font-semibold sm:text-6xl">
                            {state.hero.name}
                        </h1>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-5 py-9 sm:px-8 sm:py-12 lg:px-12">
                <header className="mb-5 flex items-end justify-between gap-4 border-b border-[#34362e] pb-4">
                    <div>
                        <p className="mb-2 font-mono text-[10px] tracking-[0.18em] text-[#c9df69]">
                            COUNTER LOADOUT
                        </p>
                        <h2 className="font-serif text-3xl font-semibold">Counter items</h2>
                    </div>
                    <p className="font-mono text-[10px] tracking-[0.12em] text-[#77796f]">
                        {String(heroCounterItems.length).padStart(2, "0")} ITEMS
                    </p>
                </header>

                {heroCounterData && (
                    <p className="mb-5 max-w-3xl text-sm leading-relaxed text-[#a4a497]">
                        {heroCounterData.threat_profile}
                    </p>
                )}

                {heroCounterItems.length > 0 ? (
                    <ul className="divide-y divide-[#303229]">
                        {heroCounterItems.map((item, index) => (
                            <li className="flex items-start gap-4 py-4" key={`${item.item}-${index}`}>
                                <span className="font-mono text-xs text-[#c9df69]">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <div aria-hidden="true" className="flex shrink-0 gap-1">
                                    {item.item
                                        .split("/")
                                        .map((part) => part.trim())
                                        .map((part) => {
                                            const itemName = itemIconAliases[part.toLowerCase()] ?? part.toLowerCase();
                                            const image = itemImages[itemName];
                                            return image ? (
                                                <Image
                                                    alt=""
                                                    className="size-11 border border-[#34362e] bg-[#171914] object-contain p-1"
                                                    height={44}
                                                    key={part}
                                                    src={image}
                                                    width={44}
                                                />
                                            ) : null;
                                        })}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                        <h3 className="text-base font-medium text-[#e7e6dc]">
                                            {item.item}
                                        </h3>
                                        <p className="font-mono text-[10px] tracking-[0.1em] text-[#77796f]">
                                            {item.category} / TIER {item.tier}
                                        </p>
                                    </div>
                                    <p className="mt-1 text-sm leading-relaxed text-[#a4a497]">
                                        {item.reason}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="py-6 text-sm text-[#a4a497]">
                        No counter information for this hero in the guide yet.
                    </p>
                )}
            </section>
        </main>
    );
}