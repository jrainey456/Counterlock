import HeroDetail from "./hero-detail";

export default async function HeroPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return <HeroDetail slug={slug} />;
}