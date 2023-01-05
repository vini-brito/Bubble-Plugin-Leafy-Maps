function(properties, context) {

  const fetch = require('node-fetch');

  // this declares AND calls it at the same time
  let resultName = context.async(async callback => {

    try {

      const options = {

        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      };

      let response = await fetch(`https://geoenrich.arcgis.com/arcgis/rest/services/World/GeoEnrichmentServer/Geoenrichment/Enrich?studyareas=[{"geometry":{"x":-56.042647,"y":-15.641970}}]&f=pjson&analysisVariables=["15YearIncrements.PAGE02_CY,15YearIncrements.PAGE03_CY,15YearIncrements.PAGE04_CY,KeyFacts.TOTPOP_CY,KeyFacts.POPDENS_CY,KeyFacts.POPPRM_CY,Gender.FEMALES_CY,Gender.MALES_CY,KeyGlobalFacts.TOTPOP,KeyGlobalFacts.TOTHH,KeyGlobalFacts.TOTMALES,KeyGlobalFacts.TOTFEMALES,KeyGlobalFacts.AVGHHSZ,KeyFacts.PP_CY,KeyFacts.PPIDX_CY,KeyFacts.PPPC_CY,KeyFacts.PPPRM_CY,15YearIncrements.PAGE01_CY,15YearIncrements.PAGE05_CY,HouseholdTotals.TOTHH_CY,HouseholdTotals.AVGHHSZ_CY,EducationalAttainment.EDUC02_CY,EducationalAttainment.EDUC03_CY,EducationalAttainment.EDUC04_CY,Spending.CS01_CY,Spending.CS04_CY,Spending.CS13_CY,Spending.CS02_CY,Spending.CS02PRM_CY,Spending.CSPC02_CY,Spending.CS02IDX_CY,Spending.CS17_CY,Spending.CS17PRM_CY,Spending.CSPC17_CY,Spending.CS17IDX_CY,Spending.CS18_CY,Spending.CS18PRM_CY,Spending.CSPC18_CY,Spending.CS18IDX_CY,Spending.CS04PRM_CY,Spending.CSPC04_CY,Spending.CS04IDX_CY,Spending.CS13PRM_CY,Spending.CSPC13_CY,Spending.CS13IDX_CY,Spending.CS15_CY,Spending.CS15PRM_CY,Spending.CSPC15_CY,Spending.CS15IDX_CY,Spending.CS01PRM_CY,Spending.CSPC01_CY,Spending.CS01IDX_CY,Spending.CS05_CY,Spending.CS05PRM_CY,Spending.CSPC05_CY,Spending.CS05IDX_CY,Spending.CS06_CY,Spending.CS06PRM_CY,Spending.CSPC06_CY,Spending.CS06IDX_CY,Spending.CS10_CY,Spending.CS10PRM_CY,Spending.CSPC10_CY,Spending.CS10IDX_CY,Spending.CS08_CY,Spending.CS08PRM_CY,Spending.CSPC08_CY,Spending.CS08IDX_CY,Spending.CS11_CY,Spending.CS11PRM_CY,Spending.CSPC11_CY,Spending.CS11IDX_CY,Spending.CS07_CY,Spending.CS07PRM_CY,Spending.CSPC07_CY,Spending.CS07IDX_CY,Spending.CS09_CY,Spending.CS09PRM_CY,Spending.CSPC09_CY,Spending.CS09IDX_CY,Spending.CS20_CY,Spending.CS20PRM_CY,Spending.CSPC20_CY,Spending.CS20IDX_CY,Spending.CS12_CY,Spending.CS12PRM_CY,Spending.CSPC12_CY,Spending.CS12IDX_CY,Spending.CS19_CY,Spending.CS19PRM_CY,Spending.CSPC19_CY,Spending.CS19IDX_CY,Spending.CS14_CY,Spending.CS14PRM_CY,Spending.CSPC14_CY,Spending.CS14IDX_CY,Spending.CS16_CY,Spending.CS16PRM_CY,Spending.CSPC16_CY,Spending.CS16IDX_CY,Spending.CS03_CY,Spending.CS03PRM_CY,Spending.CSPC03_CY,Spending.CS03IDX_CY,15YearIncrements.FAGE01_CY,15YearIncrements.FAGE02_CY,15YearIncrements.FAGE03_CY,15YearIncrements.FAGE04_CY,15YearIncrements.FAGE05_CY,15YearIncrements.MAGE01_CY,15YearIncrements.MAGE02_CY,15YearIncrements.MAGE03_CY,15YearIncrements.MAGE04_CY,15YearIncrements.MAGE05_CY,EducationalAttainment.EDUC01_CY,EducationalAttainment.EDUC05_CY"]&token=${context.keys["ESRI key"]}`, options);

      let jsonFormat = await response.json();

      let result = jsonFormat.results[0].value.FeatureSet[0].features[0].attributes;

      callback(null, result);

    }

    catch (err) {

      callback(err);

    }

  });

  // this returns it from server side

  return resultName


}