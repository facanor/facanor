import { getCollection } from 'astro:content';
import rss, { type RSSFeedItem } from '@astrojs/rss';

export async function GET() {
    const postsEntries = await getCollection('publications', ({ data }) => {
        return !data.draft && !data.archived;
    });
    const posts = postsEntries.sort(
        (a, b) => new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
    );

    return rss({
        title: "Blog | Fabian Cano",
        description: 'Engineer, researcher and amateur gamer',
        site: import.meta.env.SITE,
        items: posts.map(post => ({
            title: post?.data?.title,
            link: `/publications/${post.slug}/`,
            pubDate: new Date(post.data.publishedAt),
            description: post.data.description
        })) as RSSFeedItem[]
    });
}
