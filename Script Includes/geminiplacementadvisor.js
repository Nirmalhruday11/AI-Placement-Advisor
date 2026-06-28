var GeminiPlacementAdvisor = Class.create();
GeminiPlacementAdvisor.prototype = {
    initialize: function() {},

    getAdvice: function(candidateName, companyName, matchScore, missingSkills) {

        var apiKey = "PASTE_YOUR_GEMINI_API_KEY_HERE";

        var prompt =
            "You are an AI placement advisor. Give short career advice for a student.\n" +
            "Candidate: " + candidateName + "\n" +
            "Company: " + companyName + "\n" +
            "Match Score: " + matchScore + "%\n" +
            "Missing Skills: " + missingSkills + "\n" +
            "Give advice in 2-3 simple lines.";

        var request = new sn_ws.RESTMessageV2();
        request.setEndpoint("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent");
        request.setHttpMethod("POST");
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("x-goog-api-key", apiKey);

        var body = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        };

        request.setRequestBody(JSON.stringify(body));

        var response = request.execute();
        var responseBody = response.getBody();

        var json = JSON.parse(responseBody);

        if (json.candidates && json.candidates.length > 0) {
            return json.candidates[0].content.parts[0].text;
        }

        return "AI advice not generated.";
    },

    type: 'GeminiPlacementAdvisor'
};