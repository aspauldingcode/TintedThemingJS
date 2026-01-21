import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // List of paths that MUST have a trailing slash for the proxy/vite to work
    const forcedSlashPaths = [
        '/vite_reactjs',
        '/vanilla-js',
        '/vanilla-ts',
        '/remix'
    ]

    // Check if the current path is exactly one of these (without slash)
    if (forcedSlashPaths.some(path => pathname === path)) {
        const url = request.nextUrl.clone()
        url.pathname = pathname + '/'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/vite_reactjs',
        '/vanilla-js',
        '/vanilla-ts',
        '/remix'
    ]
}
