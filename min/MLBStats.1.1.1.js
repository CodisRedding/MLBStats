(a=>{"use strict";"undefined"==typeof MLBStats&&(a.MLBStats=function(){const d={main:1,sub:1,patch:0},f=[{name:"Jake Hall",website:"http://jakehall.me"}];let h={};return h.manual=()=>{let j=`MLBStats\n`+`v${d.main}.${d.sub}.${d.patch}\n\n`+`Created By:\n`+`${f[0].name}\t${f[0].website}\n\n`+`For more information on how to use the MLBStats library `+`check out the "readme.md" on GitHub here (Copy & Paste):\n\n`+`https://github.com/jakeehall/MLBStats/blob/master/readme.md\n\n`+`If any issues related to this library occur, please report`+`all available issue-related information to our GitHub page!`;if(1<f.length){j+=`\n\nContributors:\n`;for(let k=1,l=f.length;k<l;k++)j+=`${f[k].name}\t${f[k].website}\n`}alert(j)},h.version=(j=!1)=>{return j&&console.log(`v${d.main}.${d.sub}.${d.patch}`),d},h.formatDate=j=>{let k=`Invalid Date Format!\n`+`Use one of the lookup formats listed below:\n`+`1. Shortcut Date: -1=Yesterday, 0=Today, 1=Tomorrow...\n`+`2. Formatted Date Object: {year: 2017, month: 9, day: 1}\n`+`3. JavaScript Date Object`;if("undefined"==typeof j&&(j=0),"number"==typeof j){const l=new Date;l.setDate(l.getDate()+j),j=l}if("object"==typeof j){let l,p,q,r=1;if(j instanceof Date)l=j.getFullYear(),p=j.getMonth()+1,q=j.getDate();else if("undefined"!=typeof j.year&&"undefined"!=typeof j.month&&"undefined"!=typeof j.day)l=+j.year,p=+j.month,q=+j.day,"undefined"!=typeof j.game&&(r=+j.game);else return console.error(`${k}\nUnknown Date Object!`),null;return 10>p&&(p="0"+p),10>q&&(q="0"+q),{year:l,month:p,day:q,game:r}}return console.error(k),null},h.formatGameID=j=>{let k=j.length;if(26===k)return"gid_"+j.replace(/\/|-/g,"_")},h.gameToDate=(j,k)=>{h.searchForGameID(j,l=>{if(null!==l&&"string"==typeof l){if(0===l.search("gid")&&30===l.length){let p=l.slice(4,8),q=l.slice(9,11),r=l.slice(12,14),t=l.slice(-1);return k({year:p,month:q,day:r,game:t})}return console.error(`Cannot return Formatted Date from this gameID:\n${l}`),k(null)}return console.error(`Cannot find a gameID with this Search Object:\n${j}`),k(null)})},h.searchForGameID=(j,k)=>{let l=`Invalid Search Object!\n`+`Pass either a gameID as a String, or a Search Object:\n`+`{date: {year: 2017, month: 9, day: 1, game: 1}, playerID: 453568}\n`+`Note: Must include either a playerID or teamID member!\n`;if("string"==typeof j)return k(j);if("object"==typeof j){if("string"==typeof j.gameID)return k(j.gameID);if(j.date=h.formatDate(j.date),"number"==typeof j.playerID||"string"==typeof j.playerID)request({leauge:"mlb",date:j.date,endpoint:`/batters/${j.playerID}_${j.date.game}.xml`},p=>{let q=h.formatGameID(p.batting.game_id),r={},t={};for(let u in p.batting)if(!u.startsWith("s_"))if(u.startsWith("ser_")){let v=u.slice(4);t[v]=p.batting[u]}else r[u]=p.batting[u];return k(q,r,t)});else if("string"==typeof j.teamID)h.gamesOnDate([{search:{date:j.date}}],p=>{for(let t,q=0,r=p[0].length;q<r;q++)if(t=p[0][q],console.warn(t),t.away_code===j.teamID||t.away_name_abbrev===j.teamID||t.home_code===j.teamID||t.home_name_abbrev===j.teamID){if(1===j.date.game){let u=h.formatGameID(t.id);return k(u)}if(2===t.game_nbr||"Y"===t.double_header_sw){let u=h.formatGameID(t.id);return k(u)}continue}});else return console.error(l),k(null)}else return console.error(l),k(null)},h.player=(j,k)=>{Array.isArray(j)||(j=[j]);let l={},p=0,q=j.length,r=t=>{if(p++,null!==t&&(l[t.batter.id]=t),p===q)return k(l)};j.forEach(t=>{let w=h.formatDate(t.search.date);h.searchForGameID(t.search,(x,y,z)=>{null===x?r(null):request({leauge:"mlb",date:w,endpoint:`/${x}/batters/${t.search.playerID}.xml`},A=>{let B={};null===A&&r(null),B.batter=A.Player,B.batter.game=y,B.batter.series=z,B.date=w,B.rq=t,"P"===A.Player.pos?request({leauge:"mlb",date:w,endpoint:`/${x}/pitchers/${t.search.playerID}.xml`},C=>{null!==C&&(B.pitcher=C.Player),r(B)}):r(B)})})})},h.gamesOnDate=(j,k)=>{Array.isArray(j)||(j=[j]);let l=[],p=0;j.forEach((q,r,t)=>{let u=h.formatDate(q.search.date);request({leauge:"mlb",date:u,endpoint:`/master_scoreboard.json`},v=>{if("undefined"!=typeof v.data.games.game&&(v.data.games.game.rq=q,l.push(v.data.games.game)),p++,p===t.length)return k(l)})})},h.game=(j,k)=>{Array.isArray(j)||(j=[j]);let l=[],p=0;j.forEach((q,r,t)=>{h.searchForGameID(q.search,u=>{h.gameToDate(u,v=>{request({leauge:"mlb",date:v,endpoint:`/${u}/linescore.json`},w=>{if(w.data.game.rq=q,l.push(w.data.game),p++,p===t.length)return k(l)})})})})},h.bench=(j,k)=>{Array.isArray(j)||(j=[j]);let l=[],p=0;j.forEach((q,r,t)=>{h.searchForGameID(q.search,u=>{h.gameToDate(u,v=>{request({leauge:"mlb",date:v,endpoint:`/${u}/benchO.xml`},w=>{if(w.bench.rq=q,l.push(w.bench),p++,p===t.length)return k(l)})})})})},h}())})(window);function request(a,b){const d=new XMLHttpRequest;d.withCredentials=!1,d.addEventListener("readystatechange",function(){if(4===this.readyState&&200===this.status){if(a.endpoint.endsWith("xml")){let f=new DOMParser().parseFromString(this.responseText,"text/xml"),h=xml2json(f);return b(JSON.parse(h))}return a.endpoint.endsWith("json")?b(JSON.parse(this.responseText)):b(null)}}),d.open("GET",`http://gd2.mlb.com/components/game/`+`${a.leauge}/`+`year_${a.date.year}/`+`month_${a.date.month}/`+`day_${a.date.day}`+`${a.endpoint}`,!0),d.send(null)}function xml2json(a){var b={toObj:function(f){var h={};if(1==f.nodeType){if(f.attributes.length)for(var j=0;j<f.attributes.length;j++)h[f.attributes[j].nodeName]=(f.attributes[j].nodeValue||"").toString();if(f.firstChild){for(var k=0,l=0,p=!1,q=f.firstChild;q;q=q.nextSibling)1==q.nodeType?p=!0:3==q.nodeType&&q.nodeValue.match(/[^ \f\n\r\t\v]/)?k++:4==q.nodeType&&l++;if(p){if(2>k&&2>l){b.removeWhite(f);for(var q=f.firstChild;q;q=q.nextSibling)3==q.nodeType?h["#text"]=b.escape(q.nodeValue):4==q.nodeType?h["#cdata"]=b.escape(q.nodeValue):h[q.nodeName]?h[q.nodeName]instanceof Array?h[q.nodeName][h[q.nodeName].length]=b.toObj(q):h[q.nodeName]=[h[q.nodeName],b.toObj(q)]:h[q.nodeName]=b.toObj(q)}else f.attributes.length?h["#text"]=b.escape(b.innerXml(f)):h=b.escape(b.innerXml(f));}else if(k)f.attributes.length?h["#text"]=b.escape(b.innerXml(f)):h=b.escape(b.innerXml(f));else if(l)if(1<l)h=b.escape(b.innerXml(f));else for(var q=f.firstChild;q;q=q.nextSibling)h["#cdata"]=b.escape(q.nodeValue)}f.attributes.length||f.firstChild||(h=null)}else 9==f.nodeType?h=b.toObj(f.documentElement):console.error("Unhandled node type: "+f.nodeType);return h},toJson:function(f,h,j){var k=h?"\""+h+"\"":"";if(f instanceof Array){for(var l=0,p=f.length;l<p;l++)f[l]=b.toJson(f[l],"",j+"\t");k+=(h?":[":"[")+(1<f.length?"\n"+j+"\t"+f.join(",\n"+j+"\t")+"\n"+j:f.join(""))+"]"}else if(null==f)k+=(h&&":")+"null";else if("object"==typeof f){var q=[];for(var r in f)q[q.length]=b.toJson(f[r],r,j+"\t");k+=(h?":{":"{")+(1<q.length?"\n"+j+"\t"+q.join(",\n"+j+"\t")+"\n"+j:q.join(""))+"}"}else k+="string"==typeof f?(h&&":")+"\""+f.toString()+"\"":(h&&":")+f.toString();return k},innerXml:function(f){var h="";if("innerHTML"in f)h=f.innerHTML;else for(var j=function(l){var p="";if(1==l.nodeType){p+="<"+l.nodeName;for(var q=0;q<l.attributes.length;q++)p+=" "+l.attributes[q].nodeName+"=\""+(l.attributes[q].nodeValue||"").toString()+"\"";if(l.firstChild){p+=">";for(var r=l.firstChild;r;r=r.nextSibling)p+=j(r);p+="</"+l.nodeName+">"}else p+="/>"}else 3==l.nodeType?p+=l.nodeValue:4==l.nodeType&&(p+="<![CDATA["+l.nodeValue+"]]>");return p},k=f.firstChild;k;k=k.nextSibling)h+=j(k);return h},escape:function(f){return f.replace(/[\\]/g,"\\\\").replace(/[\"]/g,"\\\"").replace(/[\n]/g,"\\n").replace(/[\r]/g,"\\r")},removeWhite:function(f){f.normalize();for(var h=f.firstChild;h;)if(!(3==h.nodeType))1==h.nodeType?(b.removeWhite(h),h=h.nextSibling):h=h.nextSibling;else if(!h.nodeValue.match(/[^ \f\n\r\t\v]/)){var j=h.nextSibling;f.removeChild(h),h=j}else h=h.nextSibling;return f}};9==a.nodeType&&(a=a.documentElement);var d=b.toJson(b.toObj(b.removeWhite(a)),a.nodeName,"\t");return"{\n\t"+d.replace(/\t/g,"\t")+"\n}"}