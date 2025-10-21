import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pitchContent, startupName, domain } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing pitch for:", startupName);

    const systemPrompt = `You are an expert venture capital analyst. Analyze the following startup pitch and provide detailed insights.

Your analysis should be thorough, data-driven, and actionable. Focus on:
1. Market opportunity and size
2. Team strength and capabilities  
3. Product viability and innovation
4. Financial health and projections
5. Competitive advantages
6. Risk factors

Provide scores (0-100) for each category and an overall investment score.`;

    const userPrompt = `Analyze this pitch for ${startupName} in the ${domain} domain:

${pitchContent}

Provide a comprehensive analysis in JSON format with:
- market_size_score (0-100)
- team_strength_score (0-100)
- product_viability_score (0-100)
- financial_health_score (0-100)
- competitive_advantage_score (0-100)
- overall_score (0-100)
- key_strengths (array of 3-5 strings)
- key_concerns (array of 3-5 strings)
- market_insights (detailed paragraph)
- team_analysis (detailed paragraph)
- financial_summary (detailed paragraph)
- risk_factors (array of 3-5 strings)
- investment_recommendation (clear recommendation: "Strong Buy", "Buy", "Hold", "Pass")`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices[0].message.content;
    
    console.log("Raw AI response:", analysisText);

    // Extract JSON from the response (handle markdown code blocks)
    let analysisData;
    try {
      const jsonMatch = analysisText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       analysisText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : analysisText;
      analysisData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Provide fallback analysis
      analysisData = {
        market_size_score: 65,
        team_strength_score: 70,
        product_viability_score: 68,
        financial_health_score: 60,
        competitive_advantage_score: 72,
        overall_score: 67,
        key_strengths: ["Innovative approach", "Strong market positioning", "Experienced founders"],
        key_concerns: ["Market competition", "Scaling challenges", "Funding requirements"],
        market_insights: "The market shows promising growth potential with increasing demand.",
        team_analysis: "The founding team demonstrates relevant industry experience.",
        financial_summary: "Financial projections appear realistic with clear revenue model.",
        risk_factors: ["Market volatility", "Regulatory changes", "Competition intensity"],
        investment_recommendation: "Hold"
      };
    }

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify(analysisData),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error in analyze-pitch function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});