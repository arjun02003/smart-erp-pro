import { NextResponse } from "next/server";

export async function POST(): Promise<Response> {
  try {
    // This endpoint is for development/CI-CD only and should not be used in production
    // Render does not support shell execution from Node.js for security reasons
    
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'Git operations are not allowed on Render. Use webhooks or CI/CD instead.',
        },
        { status: 403 }
      );
    }

    // For development only - this would work on Windows machines
    return NextResponse.json(
      {
        success: true,
        message: 'Git push endpoint is disabled. Use git webhooks or CI/CD pipelines instead.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}