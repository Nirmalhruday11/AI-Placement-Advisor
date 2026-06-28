(function executeRule(current, previous) {

    var candidate = current.candidate_name.toString();
    var candidateUser = "";

    var candidateGR = new GlideRecord('x_1976595_ai_pla_0_candidate_profile');
    candidateGR.addQuery('candidate_name', candidate);
    candidateGR.query();

    if (candidateGR.next()) {
        candidateUser = candidateGR.user;
    }

    var oldResults = new GlideRecord('x_1976595_ai_pla_0_career_match_results');
    oldResults.addQuery('candidate_name', candidate);
    oldResults.query();

    while (oldResults.next()) {
        oldResults.deleteRecord();
    }

    var candidateSkills = [];

    var skillGR = new GlideRecord('x_1976595_ai_pla_0_skill_inventory');
    skillGR.addQuery('candidate_name', candidate);
    skillGR.query();

    while (skillGR.next()) {
        candidateSkills.push(skillGR.skill_name.toString().toLowerCase().trim());
    }

    var companyGR = new GlideRecord('x_1976595_ai_pla_0_opportunity_catalog');
    companyGR.query();

    while (companyGR.next()) {

        var companyName = companyGR.company_name.toString();
        var requiredSkills = companyGR.required_skills.toString().split(',');

        var matched = 0;
        var missing = [];

        for (var i = 0; i < requiredSkills.length; i++) {
            var requiredSkill = requiredSkills[i].trim();
            var requiredSkillLower = requiredSkill.toLowerCase();

            if (candidateSkills.indexOf(requiredSkillLower) > -1) {
                matched++;
            } else {
                missing.push(requiredSkill);
            }
        }

        var totalSkills = requiredSkills.length;
        var matchScore = Math.round((matched / totalSkills) * 100);

        var recommendation = "";

        if (matchScore >= 80) {
            recommendation = "Highly Recommended";
        } else if (matchScore >= 50) {
            recommendation = "Recommended";
        } else {
            recommendation = "Needs Skill Improvement";
        }

        var missingSkillsText = missing.length > 0 ? missing.join(', ') : "No Missing Skills";

        var resultGR = new GlideRecord('x_1976595_ai_pla_0_career_match_results');
        resultGR.initialize();

        resultGR.candidate_name = candidate;
        resultGR.user = candidateUser;
        resultGR.company_name = companyName;
        resultGR.match_score = matchScore;
        resultGR.missing_skills = missingSkillsText;
        resultGR.recommendation_skills = recommendation;
        resultGR.ai_advice = "AI advice pending";

        resultGR.insert();
    }

})(current, previous);