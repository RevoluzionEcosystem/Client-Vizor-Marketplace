import { NextRequest, NextResponse } from "next/server";

// Add export config to specify that this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Use edge runtime for better performance

// Redirect to the polygon endpoint for consistent naming
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    
    // Get the query parameters from the original request
    const queryParams = url.searchParams.toString();
    
    // Construct the new URL with the polygon endpoint
    const newUrl = new URL(`${url.origin}/crosschain-swap/api/validate/polygon?${queryParams}`);
    
    // Return a redirect response
    return NextResponse.redirect(newUrl);
}