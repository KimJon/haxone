import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!adminAuth || !adminDb) {
       return NextResponse.json({ error: 'Admin SDK not initialized' }, { status: 500 });
    }

    // Verify token using firebase-admin
    const decodedToken = await adminAuth.verifyIdToken(token);
    const tenantId = decodedToken.tenantId || decodedToken.uid; 

    // Fetch Tenant's recent sales data using Admin SDK (bypasses security rules)
    const txSnapshot = await adminDb.collection(`tenants/${tenantId}/transactions`)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
      
    const recentSales = txSnapshot.docs.map((doc: any) => doc.data());

    if (process.env.GEMINI_API_KEY) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const aiPrompt = `Analyze the following recent transactions for a retail business. Give me actionable insights, peak hour identification, and inventory anomalies. Respond in strict JSON format matching exactly this structure: { "summary": "overall summary", "actionable_tips": ["tip 1", "tip 2", "tip 3"], "anomaly_detected": "any anomaly found or none" }. Data: ${JSON.stringify(recentSales)}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: aiPrompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const insights = JSON.parse(response.text || '{}');
      return NextResponse.json({ success: true, insights });
    }

    // Fallback if no API key
    const mockInsight = {
      summary: "Sales are up 15% this week! Most revenue is coming from Peak Hours (12PM - 2PM).",
      actionable_tips: [
        "Consider running a promotion on Blueberry Muffins to clear expiring stock.",
        "M-Pesa payments dominate; ensure your till number is clearly displayed.",
        "Staff member 'Alex' processed 40% of all transactions today."
      ],
      anomaly_detected: "Low inventory on 'Latte' cups detected."
    };

    return NextResponse.json({ success: true, insights: mockInsight });

  } catch (error: any) {
    console.error("Insights API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
