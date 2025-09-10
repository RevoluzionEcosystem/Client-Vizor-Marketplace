import { ZenRows } from "zenrows"
import { NextResponse, NextRequest } from "next/server"

import general from "@/data/lang/en/general"
import whitelist from "@/components/modules/view/crosschain-swap/components/whitelist"

// Add export config to specify that this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'edge'; // Use edge runtime for better performance

const terms = general["terms"]
const api = process.env.NEXT_PUBLIC_PROJECT_ID
const requestCounts: Map<string, number> = new Map()

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        const apiKey = request.headers.get("API-Key")
        const expectedApiKey = api
        const requestCount = requestCounts.get(apiKey) || 0

        const network = searchParams.get("network")
        const search = searchParams.get("search")

        if (apiKey !== expectedApiKey) {
            return new Response(terms.unauthorized, { status: 401 })
        }

        if (requestCount >= 60) {
            return new Response(terms.rate_limit, { status: 429 })
        }

        requestCounts.set(apiKey, requestCount + 1)

        setTimeout(() => {
            requestCounts.delete(apiKey)
        }, 60000)

        const client = new ZenRows(process.env.zenrows_api);
        const url = `https://${whitelist["network"][whitelist["network"].findIndex(item => item.id === network)].link}/searchHandler?term=${search}&filterby=0`;

        const fetch_data = await client.get(url, {
            "autoparse": true
        });
        const temp = await fetch_data.json();

        let data = []
        let int = 0

        while (int < temp.length) {
            if (temp[int]["group"].split(" ")[0] === "Tokens") {
                data.push(temp[int])
            }
            int++
        }

        return NextResponse.json({ data });
    } catch (err) {
        return NextResponse.json({ message: err })
    }
}