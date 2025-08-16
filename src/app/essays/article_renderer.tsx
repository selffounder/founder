'use client'

import { MDXRemote } from "next-mdx-remote";
import {serialize} from 'next-mdx-remote/serialize';
import remarkgfm from 'remark-gfm';
import rehypeSlug from "rehype-slug";
import rehypeautolinkheadings from "rehype-autolink-headings";
import rehypehighlight from "rehype-highlight";
import { useEffect, useState } from 'react';
import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

interface ArticleRendererProps {
    article: string;
    className?: string;
}

interface customComponents {
    [key: string]: React.ComponentType<any>;
}

const components: customComponents = {
    h1: ({children}) => <h1 className="text-2xl font-bold">{children}</h1>,
    h2: ({children}) => <h2 className="text-xl font-bold">{children}</h2>,
    h3: ({children}) => <h3 className="text-lg font-semibold">{children}</h3>,
    h4: ({children}) => <h4 className="text-base font-semibold">{children}</h4>,
    h5: ({children}) => <h5 className="text-sm font-semibold">{children}</h5>,
}


export default function ArticleRenderer({article, className}: ArticleRendererProps) {
    const [serializedArticle, setSerializedArticle] = useState<any>(null);

    useEffect(() => {
        serialize(article, {
            mdxOptions: {
                remarkPlugins: [remarkgfm],
                rehypePlugins: [rehypeautolinkheadings, rehypehighlight, rehypeSlug],
            },
        }).then(setSerializedArticle);
    }, [article]);

    if (!serializedArticle) return <div>Loading...</div>;
    
 



    return (
        <div className={className}>
            <MDXRemote 
                {...serializedArticle} 
                components={components}
            />
        </div>
    );
}
