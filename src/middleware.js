import { NextResponse } from "next/server";

const allowedOrigins = [
  
  "event-master-ten.vercel.app",
  "https://event-master-pranav-deshmukhs-projects-2a38252e.vercel.app/",
  "https://event-master-git-main-pranav-deshmukhs-projects-2a38252e.vercel.app/"
];

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request) {
  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);
  console.log(isAllowedOrigin);

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });


  return response;
}

export const config = {
  matcher: "/api/:path*",
  // api: {
  //   bodyParser: true,
  // },
};
