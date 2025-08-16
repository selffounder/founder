
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

interface EssayMetadata {
    title?: string;
    date?: string;
    description?: string;
    tags?: string[];
    readTime?: string;
}

interface Essay {
    slug: string;
    metadata: EssayMetadata;
}

async function getEssays(): Promise<Essay[]> {
    try {
        const essaysDirectory = path.join(process.cwd(), 'src/app/essays');
        const files = await fs.readdir(essaysDirectory);
        
        const essays = await Promise.all(
            files
                .filter(file => file.endsWith('.md'))
                .map(async (file) => {
                    const slug = file.replace('.md', '');
                    const filePath = path.join(essaysDirectory, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const { data } = matter(content);
                    
                    return {
                        slug,
                        metadata: data as EssayMetadata
                    };
                })
        );

        return essays.sort((a, b) => {
            if (a.metadata.date && b.metadata.date) {
                return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
            }
            return 0;
        });
    } catch (error) {
        return [];
    }
}

export default async function EssaysPage() {
    const essays = await getEssays();

    return (
        <div className="min-h-screen bg-black font-mono">
            <div className="px-4 py-2 border-b border-green-500/30">
                <div className="text-xs text-green-400 mb-2">
                    <span>root@founderbase:~$</span> <span className="text-gray-500">ls -la /essays</span>
                </div>
                <div className="text-xs text-green-400">
                    <span>root@founderbase:~$</span> <span className="text-gray-500">cat essays.md</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold text-green-400 mb-4">
                        <span className="text-green-500">#</span> Essays & Insights
                    </h1>
                    <p className="text-gray-400 leading-relaxed max-w-2xl">
                        <span className="text-green-500">//</span> Essays on startups, AI, and education. 
                        Written by Alisher, a full-time thinker and builder.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {essays.map((essay) => (
                        <Link 
                            key={essay.slug}
                            href={`/essays/${essay.slug}`}
                            className="group block"
                        >
                            <article className="bg-gray-900 border border-green-500/30 rounded-lg p-6 hover:border-green-400/50 transition-colors duration-300">
                               
                                <div className="flex items-center justify-between mb-3 text-xs">
                                    <span className="text-green-400 font-bold">
                                        <span className="text-green-500">-rw-r--r--</span> 1 root root
                                    </span>
                                    {essay.metadata.readTime && (
                                        <span className="text-gray-500 font-mono">
                                            {essay.metadata.readTime}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-lg font-bold text-green-300 mb-3 group-hover:text-green-200 transition-colors">
                                    <span className="text-green-500">./</span>{essay.slug}.md
                                </h2>
                                {essay.metadata.description && (
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                        {essay.metadata.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    {essay.metadata.date && (
                                        <time className="font-mono">
                                            {new Date(essay.metadata.date).toLocaleDateString()}
                                        </time>
                                    )}
                                    
                                    {essay.metadata.tags && essay.metadata.tags.length > 0 && (
                                        <div className="flex space-x-2">
                                            {essay.metadata.tags.slice(0, 2).map((tag: string) => (
                                                <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 rounded border border-gray-600">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 text-xs text-gray-600 font-mono">
                                    <span className="text-green-500">$</span> cat {essay.slug}.md
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                
                {essays.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-500 mb-4">
                            <span className="text-green-500">$</span> ls -la /essays
                        </div>
                        <div className="text-gray-400 font-mono">
                            total 0<br/>
                            drwxr-xr-x 2 root root 4096 Jan 01 00:00 .<br/>
                            drwxr-xr-x 3 root root 4096 Jan 01 00:00 ..
                        </div>
                        <p className="text-gray-500 mt-4">
                            No essays found. Start writing to populate the directory.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
