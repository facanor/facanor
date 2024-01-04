import { XataClient } from './generated';

const xata = new XataClient({
    apiKey: import.meta.env.XATA_API_KEY,
    branch: import.meta.env.XATA_BRANCH
});

export async function getLatestPublications() {
    const query = await xata.db.publications.filter({
        draft: false,
        archived: false
    }).sort('date', 'desc').getMany({
        pagination: { size: 2 }
    });
    return query;
}

export async function getPublications() {
    const query = await xata.db.publications.filter({
        draft: false,
        archived: false
    }).getAll();
    return query;
}

export async function getProjects() {
    const query = await xata.db.projects.getAll();
    return query;
}

// 

export async function getTotalPostViews() {
    const total = await xata.db.publications.aggregate({
        totalViews: {
            sum: {
                column: 'views'
            }
        }
    });
    return total.aggs.totalViews;
}

export async function increment(slug: string) {
    try {
        const post = await xata.db.publications.filter({ slug }).getFirst();
        const currentViews = post?.views ?? 0;
        const updatedPost = await xata.db.publications.createOrUpdate(post?.id, {
            slug,
            views: currentViews + 1
        });
        return updatedPost?.views;
    } catch (error: unknown) {
        console.error(error);
        return 0;
    }
}

export async function incrementprj(slug: string) {
    try {
        const post = await xata.db.projects.filter({ slug }).getFirst();
        const currentViews = post?.views ?? 0;
        const updatedPost = await xata.db.projects.createOrUpdate(post?.id, {
            slug,
            views: currentViews + 1
        });
        return updatedPost?.views;
    } catch (error: unknown) {
        console.error(error);
        return 0;
    }
}

export async function getViewsForSlug(slug: string) {
    const post = await xata.db.publications.filter({ slug }).getFirst();
    return post?.views ?? 0;
}
