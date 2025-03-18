'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function ConditionalLayout({ children }) {
    const pathname = usePathname();
    const [ml, setMl] = useState(64);

    const isAuthPage = pathname.includes('/auth');

    return (
        <div className="flex">
            {!isAuthPage && (
                <Sidebar ml={ml} setMl={setMl} />
            )}
            <main className={`w-full ${!isAuthPage && `${ml == 14 && "ml-14"} ${ml == 64 && "ml-64"}`}`}>
                {children}
            </main>
        </div>
    );
}