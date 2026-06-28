(function executeRule(current, previous) {

    var score = parseInt(current.match_score);
    var candidate = current.candidate_name.toString();
    var company = current.company_name.toString();
    var missing = current.missing_skills.toString();

    if (score < 50) {
        current.ai_advice = "Improve the missing skills first to become eligible for better placement opportunities.";
        current.update();
        return;
    }

    try {
        var ai = new GeminiPlacementAdvisor();

        var advice = ai.getAdvice(
            candidate,
            company,
            score.toString(),
            missing
        );

        if (advice && advice != "AI advice not generated.") {
            current.ai_advice = advice;
        } else {
            current.ai_advice = "Good match for " + company + ". Improve " + missing + " to increase your placement chances.";
        }

    } catch (e) {
        current.ai_advice = "Good match for " + company + ". Improve " + missing + " to increase your placement chances.";
    }

    current.update();

})(current, previous);