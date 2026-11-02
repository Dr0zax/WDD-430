const COVER_ART_BUCKET = "cover art";

/**
 * Attach public Supabase Storage URLs to releases by matching
 * `<release.slug>.<extension>` files in the cover art bucket.
 */
export async function attachCoverArt(supabase, releases) {
    if (!releases?.length) return releases ?? [];

    const { data: files, error } = await supabase.storage
        .from(COVER_ART_BUCKET)
        .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });

    if (error) {
        console.error(`Unable to list Supabase bucket "${COVER_ART_BUCKET}":`, error.message);
        return releases;
    }

    if (!files?.length) {
        console.warn(`Supabase bucket "${COVER_ART_BUCKET}" returned no files.`);
        return releases;
    }

    const imageUrls = new Map();
    for (const file of files) {
        // Storage returns folders as entries with a null id. Only process files.
        if (!file.id) continue;

        const extension = file.name.match(/\.(avif|gif|jpe?g|png|webp)$/i);
        if (!extension) continue;

        const slug = file.name.slice(0, -extension[0].length).toLowerCase();
        const { data } = supabase.storage
            .from(COVER_ART_BUCKET)
            .getPublicUrl(file.name);
        imageUrls.set(slug, data.publicUrl);
    }

    return releases.map((release) => ({
        ...release,
        cover_image_url:
            imageUrls.get(release.slug?.toLowerCase()) || release.cover_image_url || null,
    }));
}
