import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
 
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const url = `${process.env.API_GATEWAY_URL}/Prod/updatesession`; 

    
    const body = await request.json(); // Correctly parse the JSON body

    console.log(body);

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
   
      return NextResponse.json(data, { status: response.status });
    }


    return NextResponse.json(data);
  } catch (error) {
    console.error('Update session error:', error);

    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}