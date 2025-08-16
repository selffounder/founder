'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()
    
    return (
        <header className="sticky top-0 z-50 bg-black border-b border-green-500 font-mono">
            <div className="px-4 py-2">
                <div className="flex items-center justify-between text-xs text-green-400 mb-2">
                    <span>root@founderbase:~$</span>
                    <span>ssh -p 22 alisherfounder@macintosh.local</span>
                </div>
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-green-400 hover:text-green-300 transition-colors">
                        <span className="text-green-500">$</span> cd ../..
                    </Link>
                    
                    <nav className="flex space-x-6">
                        <Link 
                            href="/" 
                            className={`${pathname === '/' ? 'text-green-400' : 'text-gray-500'} hover:text-green-300 transition-colors`}
                        >
                            <span className="text-green-500">./start</span>
                        </Link>
                        <Link href="/projects" className="text-green-400 hover:text-green-300 transition-colors">
                            <span className="text-green-500">./projects</span>
                        </Link>
                        <Link 
                            href="/essays" 
                            className={`${pathname === '/essays' ? 'text-green-400' : 'text-gray-500'} hover:text-green-300 transition-colors`}
                        >
                            <span className="text-green-500">./essays</span>
                        </Link>
                        
                    </nav>
                    
                    <div className="text-gray-500">
                        <span className="text-green-500">#</span> alisherfounder
                    </div>
                </div>
            </div>
        </header>
    )
}