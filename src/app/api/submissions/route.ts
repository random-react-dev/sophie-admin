import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveSubmission, submissionSchema } from "@/lib/submissions";

export const runtime = "nodejs";

function getCorsHeaders(): Record<string, string> {
  const allowedOrigin = process.env.ALLOWED_ORIGIN;

  return {
    "Access-Control-Allow-Origin": allowedOrigin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
}

function isAuthorized(request: NextRequest): boolean {
  const expectedToken = process.env.API_SECRET_KEY;
  const receivedToken = getBearerToken(request);

  if (!expectedToken || !receivedToken) return false;
  return receivedToken === expectedToken;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders() });
}

export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders();

  if (!process.env.API_SECRET_KEY) {
    console.error("API_SECRET_KEY is not configured");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500, headers: corsHeaders }
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415, headers: corsHeaders }
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = submissionSchema.parse(body);
    const submission = await saveSubmission(parsed);

    return NextResponse.json(
      { success: true, id: submission.id },
      { headers: corsHeaders }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }

    console.error("Error saving submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
