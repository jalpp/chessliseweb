import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  

  console.log(`[${requestId}] POST /api/createsession - Request started`, {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent'),
    contentType: req.headers.get('content-type')
  });

  if (req.method !== 'POST') {
    console.warn(`[${requestId}] Method not allowed: ${req.method}`);
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader) {
      console.warn(`[${requestId}] Missing authorization header`);
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log(`[${requestId}] Authorization header present: ${authHeader.substring(0, 20)}...`);

    let requestBody;
    try {
      requestBody = await req.json();
      console.log(`[${requestId}] Request body parsed successfully`, {
        bodyKeys: Object.keys(requestBody),
        bodySize: JSON.stringify(requestBody).length
      });
    } catch (bodyError) {
      console.error(`[${requestId}] Failed to parse request body:`, bodyError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

   
    const apiUrl = `${process.env.API_GATEWAY_URL}/Prod/addsession`;
    console.log(`[${requestId}] Making request to API Gateway`, {
      url: apiUrl,
      method: 'POST',
      hasAuth: !!authHeader,
      bodyFields: Object.keys(requestBody)
    });

    const apiStartTime = Date.now();
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(requestBody)
    });

    const apiDuration = Date.now() - apiStartTime;
    console.log(`[${requestId}] API Gateway response received`, {
      status: response.status,
      statusText: response.statusText,
      duration: `${apiDuration}ms`,
      contentType: response.headers.get('content-type')
    });

    let data;
    try {
      data = await response.json();
      console.log(`[${requestId}] API response parsed successfully`, {
        responseKeys: Object.keys(data),
        responseSize: JSON.stringify(data).length
      });
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse API response:`, parseError);
      return NextResponse.json({ error: 'Invalid response from API Gateway' }, { status: 502 });
    }
    
    if (!response.ok) {
      console.warn(`[${requestId}] API Gateway returned error`, {
        status: response.status,
        statusText: response.statusText,
        errorData: data
      });
      return NextResponse.json(data, { status: response.status });
    }


    const totalDuration = Date.now() - startTime;
    console.log(`[${requestId}] Request completed successfully`, {
      totalDuration: `${totalDuration}ms`,
      apiDuration: `${apiDuration}ms`,
      status: 200
    });

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] Unexpected error occurred`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${totalDuration}ms`,
      timestamp: new Date().toISOString()
    });

    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[${requestId}] Network error - possible API Gateway connectivity issue`);
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      requestId 
    }, { status: 500 });
  }
}