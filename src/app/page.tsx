'use client'

import Image from "next/image";
import Header from "../../components/header"
import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="px-4 py-2 border-b border-green-500/30">
        <div className="text-xs text-green-400 mb-2">
          <span>root@founderbase:~$</span> <span className="text-gray-500">pwd</span>
        </div>
        <div className="text-xs text-green-400">
          <span>root@founderbase:~$</span> <span className="text-gray-500">whoami</span>
        </div>
        <div className="text-xs text-green-400">
          <span>root@founderbase:~$</span> <span className="text-gray-500">ls -la</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
     
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-green-400 mb-6">
            <span className="text-green-500">#</span> Self Labs AI
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            <span className="text-green-500 font-bold">//</span> Welcome to my digital workspace. 
            I'm Alisher, a full-time thinker and builder.
          </p>
        </div>

        <div className="bg-gray-900 border border-green-500/30 rounded-lg p-6 mb-8">
          <div className="text-xs text-green-400 mb-4">
            <span className="text-green-500">$</span> cat about.md
          </div>
          <div className="text-gray-300 space-y-2">
            <p>Hi! My name is Alisher! I'm building startups and AI products, all while studying at Nazarbayev Intellectual School.</p>
            <p>I'm building things while learning multiple stacks, including Tauri (React, Rust, & SQLite), Next.js, Postgres, and more.</p>
            <p>I'm also researching AI and its ethical implications.
              I build an AI startup for a living.</p> 
            <Link href="https://x.com/self_founder" className="text-green-400 hover:text-green-300 transition-colors">
              <p>Follow me on X</p>
            </Link>
            <Link href="https://linkedin.com/in/alisherfounder" className="text-green-400 hover:text-green-300 transition-colors">
              <p>Follow me on LinkedIn</p>
            </Link>
            <Link href="https://github.com/alisherfounder" className="text-green-400 hover:text-green-300 transition-colors">
              <p>Follow me on GitHub</p>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-400">
            <span className="text-green-500">$</span> Available commands:
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Link 
              href="/essays" 
              className="bg-gray-900 border border-green-500/30 rounded-lg p-4 hover:border-green-400/50 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-bold text-xs">
                  <span className="text-green-500">-rw-r--r--</span> 1 root root
                </span>
                <span className="text-gray-500 text-xs">4.0K</span>
              </div>
              <h3 className="text-lg font-bold text-green-300 mb-2 group-hover:text-green-200 transition-colors">
                <span className="text-green-500">./</span>essays/
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Read my thoughts on startups, technology, and building things that matter.
              </p>
              <div className="text-xs text-gray-600 font-mono">
                <span className="text-green-500">$</span> cd essays
              </div>
            </Link>

            <Link 
              href="/projects" 
              className="bg-gray-900 border border-green-500/30 rounded-lg p-4 hover:border-green-400/50 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-bold text-xs">
                  <span className="text-green-500">-rw-r--r--</span> 1 root root
                </span>
                <span className="text-gray-500 text-xs">4.0K</span>
              </div>
              <h3 className="text-lg font-bold text-green-300 mb-2 group-hover:text-green-200 transition-colors">
                <span className="text-green-500">./</span>projects/
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                See projects I built or currently working on. Maybe open-source?
              </p>
              <div className="text-xs text-gray-600 font-mono">
                <span className="text-green-500">$</span> cd projects
              </div>
            </Link>
          </div>
        </div>

        
        <div className="mt-16 pt-8 border-t border-green-500/30">
          <div className="text-xs text-gray-500 space-y-1">
            <div><span className="text-green-500">$</span> date</div>
            <div className="text-gray-400">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
            <div className="mt-4"><span className="text-green-500">$</span> echo "Ready to build something amazing?"</div>
            <Link href="https://x.com/self_founder" className="text-green-400">Ready to build something amazing?</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
