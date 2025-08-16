import { notFound } from 'next/navigation';
import ArticleRenderer from '../article_renderer';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}


export default async function EssayPage({ params }: PageProps) {
    const { slug } = await params;
    
    try {
        const filePath = path.join(process.cwd(), 'src/app/essays', `${slug}.md`);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const { data: metadata, content: markdownContent } = matter(fileContent);
        
        return (
            <div className="container mx-auto px-8 py-20 max-w-4xl">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {metadata.title || slug}
                    </h1>
                    {metadata.date && (
                        <time className="text-gray-600 dark:text-gray-400">
                            {new Date(metadata.date).toLocaleDateString()}
                        </time>
                    )}
                    {metadata.description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {metadata.description}
                        </p>
                    )}
                </header>
                
                <ArticleRenderer article={markdownContent} className="prose prose-lg max-w-none" />
            </div>
        );
    } catch (error) {
        notFound();
    }
}