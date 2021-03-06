function get_url(request) {
  /*
   * request: the sparql request
   * return a string (url)
   */
  request = String(request);
  let url = "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=";
  let end = "&format=application%2Fsparql-results%2Bjson&CXML_redir_for_subjs=121&CXML_redir_for_hrefs=&timeout=30000&debug=on&run=+Run+Query+"
  return (url+encodeURI(request)+end);
}
function httpGet(theUrl){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
function getAllMedallist() {
  var request = "SELECT ?human WHERE{SELECT ?human (count(*) as ?count) WHERE {?event rdf:type dbo:OlympicEvent{?event dbo:bronzeMedalist ?human .  } UNION {?event dbo:silverMedalist ?human} UNION {?event dbo:goldMedalist ?human}}GROUP BY ?human}ORDER BY DESC(?count)";
  var result = String(get_url(request));
  var myObjectJSON = JSON.parse(httpGet(result));
  var nameJson = [];
  for (let i = 0; i<myObjectJSON.results.bindings.length; ++i){
    let name = myObjectJSON.results.bindings[i].human.value;
    name = name.substring(name.lastIndexOf("/")+1).replace('_', ' ');
    let toRemove = name.substring(name.lastIndexOf('(')-1);
    if(toRemove != name){
      name = name.replace(toRemove,'');
    }
    nameJson.push(name);
  }
  return nameJson;
}
