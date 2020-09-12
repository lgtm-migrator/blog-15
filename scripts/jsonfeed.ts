import { promises as fs } from 'fs';
import path from 'path';

import matter from 'gray-matter';
import renderToString from 'next-mdx-remote/render-to-string';

import { description } from '~/package.json';
import { getImageUrl } from '~/utils/get-image-url';
import { postFilePaths, POSTS_PATH } from '~/utils/mdx';
import { components } from '~/components/layouts/post';
import { Props } from '~/pages/[slug]';
import { Post } from '~/components/post-card';

const OUT_DIR = path.join(process.cwd(), 'public');

interface PostData {
  content: string;
  filePath: string;
  source: Props['source'];
  data: Post;
}

const jsonFeed = async () => {
  const posts: PostData[] = await Promise.all(
    postFilePaths.map(async filePath => {
      const source = await fs.readFile(path.join(POSTS_PATH, filePath));
      const { content, data } = matter(source);
      const mdxSource = (await renderToString(content, {
        components,
        scope: data,
      })) as Props['source'];

      return {
        content,
        filePath: filePath.replace(/\.mdx?$/, ''),
        source: mdxSource,
        data: data as Post,
      };
    })
  );

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: 'Logan McAnsh (@loganmcansh)',
    description,
    home_page_url: process.env.VERCEL_URL,
    feed_url: `${process.env.VERCEL_URL}/feed.json`,
    icon: `${process.env.VERCEL_URL}/static/images/logo/logo.png`,
    favicon: `${process.env.VERCEL_URL}/static/images/logo/logo.png`,
    author: {
      name: 'Logan McAnsh (@loganmcansh)',
      url: 'https://mcan.sh',
      avatar: `${process.env.VERCEL_URL}/static/images/headshot.jpeg`,
    },
    items: sortedPosts.map(post => ({
      id: post.filePath,
      url: `${process.env.VERCEL_URL}/${post.filePath}`,
      title: post.data.title,
      content_text: post.content,
      content_html: post.source.renderedOutput,
      summary: post.data.title,
      image: getImageUrl(post.data.image.imageUrl),
      date_published: post.data.date,
      date_modified: post.data.lastEdited,
    })),
  };

  return fs.writeFile(
    path.join(OUT_DIR, 'feed.json'),
    JSON.stringify(feed, null, 2)
  );
};

jsonFeed();
