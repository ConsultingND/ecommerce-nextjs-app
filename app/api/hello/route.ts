export async function GET() {
    return new Response('Hello from a Next.js route handler!', {
        status: 200,
    });
}

export async function POST(request: Request) {
    return new Response('Thanks for posting to this Next.js route handler!', {
        status: 200,
    });
}

export async function UPDATE(request: Request) {
    return new Response('Thanks for seeking updates from this Next.js route handler!', {
        status: 200,
    });
}