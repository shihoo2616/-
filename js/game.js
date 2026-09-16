

/* ===== DATA ===== */
const CLUBS=[
{name:"서울 FC",country:"KOR",league:"K League",strength:78,budget:42},
{name:"부산 아이파크",country:"KOR",league:"K League",strength:71,budget:28},
{name:"대전 시티",country:"KOR",league:"K League",strength:74,budget:31},
{name:"울산 블루",country:"KOR",league:"K League",strength:82,budget:55},
{name:"전북 모터스",country:"KOR",league:"K League",strength:80,budget:50},
{name:"광주 FC",country:"KOR",league:"K League",strength:69,budget:24},
{name:"수원 FC",country:"KOR",league:"K League",strength:68,budget:22},
{name:"인천 유나이티드",country:"KOR",league:"K League",strength:70,budget:26},
{name:"London United",country:"ENG",league:"Premier Division",strength:88,budget:180},
{name:"Madrid CF",country:"ESP",league:"La Liga",strength:91,budget:230},
{name:"Munich Red",country:"GER",league:"Bundesliga",strength:90,budget:210},
{name:"Milan AC",country:"ITA",league:"Serie A",strength:84,budget:140}
];
const POSITIONS={
ST:["PAC","ACC","FIN","SHO","DRI","CON","PAS","VIS","STA","PHY"],
LW:["PAC","ACC","DRI","CON","PAS","VIS","FIN","SHO","STA","PHY"],
RW:["PAC","ACC","DRI","CON","PAS","VIS","FIN","SHO","STA","PHY"],
CAM:["PAS","VIS","DRI","CON","FIN","SHO","STA","PAC","ACC","MEN"],
CM:["PAS","VIS","CON","STA","MEN","INT","PHY","DRI","PAC","ACC"],
CDM:["INT","TAC","POS","PAS","STA","PHY","MEN","VIS","CON","PAC"],
CB:["POS","TAC","INT","PHY","JMP","STA","PAC","PAS","MEN","CON"],
LB:["PAC","ACC","TAC","INT","POS","STA","PAS","CRO","PHY","MEN"],
RB:["PAC","ACC","TAC","INT","POS","STA","PAS","CRO","PHY","MEN"],
GK:["SAV","REF","HAN","AER","KIC","POS","ONE","MEN","STA","JMP"]
};
const STATS=["PAC","ACC","FIN","SHO","DRI","CON","PAS","VIS","STA","PHY","MEN","POS","TAC","INT","JMP","CRO","SAV","REF","HAN","AER","KIC","ONE"];
const STYLES=["골 결정형","돌파형","플레이메이커","박스투박스","수비형 미드필더","볼플레잉 수비수","공격형 풀백","스위퍼 키퍼"];
const BACKGROUNDS=["지역 유소년 아카데미","학교 축구부","유명 유스 아카데미","풋살 출신","길거리 축구 출신"];
const EVENTS=[
{title:"감독의 전술 변화",text:"감독이 새로운 전술을 시험하려 합니다. 당신의 역할도 달라질 수 있습니다.",a:["새 포지션에 도전한다","현재 역할을 유지한다"]},
{title:"스카우트 방문",text:"해외 구단 스카우트가 최근 경기를 관찰했습니다.",a:["경기에 집중한다","인터뷰에 응한다"]},
{title:"개인 훈련 제안",text:"전담 코치가 약점 보완 프로그램을 제안했습니다.",a:["약점을 집중 보완한다","팀 훈련에 집중한다"]},
{title:"팬들의 기대",text:"최근 활약으로 팬들의 관심이 높아졌습니다.",a:["압박을 동기부여로 삼는다","평소 루틴을 유지한다"]}
];

/* ===== GAME STATE ===== */
const KEY="footballLifeSaveV1";
function blankState(){
 const stats={}; STATS.forEach(s=>stats[s]=55+Math.floor(Math.random()*16));
 return {started:false,player:null,club:null,season:2026,week:1,energy:85,form:70,morale:70,trust:50,contract:3,wage:0,value:0,
 standings:[],history:[],awards:[],national:{caps:0,goals:0},offers:[],news:[],event:null,career:{apps:0,goals:0,assists:0,minutes:0,rating:0,trophies:0},stats};
}
function newPlayer(input){
 const s=blankState(); const stats={};
 STATS.forEach(k=>stats[k]=50+Math.floor(Math.random()*26));
 const pos=input.position;
 const boosts=POSITIONS[pos]||[];
 boosts.slice(0,4).forEach(k=>stats[k]=Math.min(90,stats[k]+8));
 return {...s,started:true,player:{name:input.name||"신인 선수",age:18,nation:input.nation||"대한민국",position:pos,foot:input.foot,style:input.style,background:input.background,potential:65+Math.floor(Math.random()*31)},
 stats,club:CLUBS.find(c=>c.name===input.club)||CLUBS[0].name,wage:1.2,value:4};
}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||blankState()}catch{return blankState()}}
function clearSave(){localStorage.removeItem(KEY)}
function avgStats(s){
 const keys=POSITIONS[s.player?.position]||STATS.slice(0,10);
 return Math.round(keys.reduce((a,k)=>a+(s.stats[k]||50),0)/keys.length);
}
function derived(s){
 const o=avgStats(s); return {ovr:o,potential:s.player?.potential||0,age:s.player?.age||18};
}
function advanceWeek(s){
 s.week++;
 if(s.week>34){endSeason(s);return {seasonEnd:true}}
 return {seasonEnd:false};
}
function endSeason(s){
 const p=s.player, o=avgStats(s);
 const apps=Math.max(5,Math.round((s.trust+s.form)/4+Math.random()*8));
 const goals=p.position==="GK"?0:Math.max(0,Math.round((o-55)*.22+Math.random()*5));
 const assists=p.position==="GK"?Math.max(0,Math.round(Math.random()*2)):Math.max(0,Math.round((o-50)*.18+Math.random()*6));
 const rating=Math.round((6.2+o/55+Math.random()*.8)*10)/10;
 s.career.apps+=apps;s.career.goals+=goals;s.career.assists+=assists;s.career.minutes+=apps*65;s.career.rating+=rating;
 const trophy=Math.random()<Math.max(.08,(CLUBS.find(c=>c.name===s.club)?.strength||70)-65)/180;
 if(trophy){s.career.trophies++;s.awards.push(`${s.season} ${s.club} 리그/컵 우승`)}
 s.history.unshift({season:s.season,club:s.club,apps,goals,assists,rating,trophy});
 const growth=Math.max(0,Math.min(4,(p.potential-o)/18))+Math.random()*2;
 Object.keys(s.stats).forEach(k=>{if(s.stats[k]<p.potential)s.stats[k]=Math.min(p.potential,Math.round(s.stats[k]+growth*(.5+Math.random())))});
 p.age++;
 if(p.age>=31) Object.keys(s.stats).forEach(k=>{if(["MEN","VIS","POS"].includes(k))return;s.stats[k]=Math.max(35,Math.round(s.stats[k]-.5-Math.random()))});
 s.season++;s.week=1;s.energy=85;s.form=72;s.morale=74;s.trust=Math.min(85,s.trust+4);s.contract--;
 if(s.contract<=0){s.contract=3;s.wage=Math.round((s.wage*(1.05+Math.random()*.15))*10)/10}
 s.news.unshift(`${s.season-1}시즌 종료: ${apps}경기 ${goals}골 ${assists}도움, 평점 ${rating}`);
 s.event=null;
}

/* ===== APP ===== */
let S=load(), view=S.started?"dashboard":"new";
const app=document.querySelector("#app");
const esc=x=>String(x??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function toast(t){const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),1800)}
function nav(){return `<aside class="sidebar"><div class="brand">⚽ 이번 생은 축구다<small>FOOTBALL LIFE SIM</small></div><div class="nav">
${[["dashboard","홈"],["match","경기"],["training","훈련"],["career","내 선수"],["records","기록"]].map(([v,t])=>`<button class="${view===v?"active":""}" data-view="${v}">${t}</button>`).join("")}</div><div class="sidebar-footer">핵심 기능만 간단하게<br>경기 → 훈련 → 성장 → 기록</div></aside>`}
function shell(body,title=""){app.innerHTML=`<div class="shell">${nav()}<main><div class="topbar"><div><div class="eyebrow">CAREER ${S.started?`· ${S.season} SEASON`:""}</div><div class="title">${title}</div><div class="sub">${S.started?`${esc(S.player.name)} · ${S.player.age}세 · ${esc(S.club)}`:"새로운 축구 인생을 시작하세요"}</div></div><div class="actions">${S.started?`<button class="btn" id="save">저장</button><button class="btn danger" id="reset">새 인생</button>`:""}</div></div>${body}</main></div>`;bind()}
function bind(){
 document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{view=b.dataset.view;render()});
 document.querySelector("#save")?.addEventListener("click",()=>{save(S);toast("저장했습니다.")});
 document.querySelector("#reset")?.addEventListener("click",()=>{if(confirm("현재 커리어를 삭제하고 새 인생을 시작할까요?")){clearSave();S=blankState();view="new";render()}});
 document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>action(b.dataset.action,b.dataset.value));
}
function statsHTML(){const keys=POSITIONS[S.player.position]||[];return `<div class="bars">${keys.map(k=>`<div class="barrow"><span>${k}</span><div class="bar"><i style="width:${S.stats[k]}%"></i></div><b>${S.stats[k]}</b></div>`).join("")}</div>`}
function dashboard(){const d=derived(S), c=CLUBS.find(x=>x.name===S.club);return `<div class="hero"><div class="profile"><div class="avatar">⚽</div><div><span class="pill">${S.player.position}</span> <span class="pill">${esc(S.player.style)}</span><h2>${esc(S.player.name)}</h2><div class="muted">${esc(S.player.nation)} · ${S.player.age}세 · ${esc(S.player.foot)}발 · 잠재력 ${S.player.potential}</div></div><div class="ovr">${d.ovr}<div class="small muted">OVR</div></div></div></div><div class="grid g4" style="margin-top:14px">${[["컨디션",S.form+"%"],["체력",S.energy+"%"],["감독 신뢰도",S.trust+"%"],["시장가치","€"+S.value.toFixed(1)+"M"]].map(x=>`<div class="card"><div class="muted small">${x[0]}</div><div class="metric">${x[1]}</div></div>`).join("")}</div><div class="grid g2" style="margin-top:14px"><div class="card"><h3>다음 경기</h3>${matchCard(c)}</div><div class="card"><h3>능력치</h3>${statsHTML()}</div></div><div class="grid g2" style="margin-top:14px"><div class="card"><h3>최근 뉴스</h3>${S.news.slice(0,5).map(n=>`<div class="row"><span>${esc(n)}</span></div>`).join("")||`<div class="empty">아직 뉴스가 없습니다.</div>`}</div><div class="card"><h3>커리어 요약</h3><div class="grid g4">${[["경기",S.career.apps],["골",S.career.goals],["도움",S.career.assists],["우승",S.career.trophies]].map(x=>`<div><div class="muted small">${x[0]}</div><b class="metric">${x[1]}</b></div>`).join("")}</div></div></div>`}
function matchCard(c){let opp=CLUBS[(CLUBS.findIndex(x=>x.name===S.club)+S.week)%CLUBS.length];if(opp.name===S.club)opp=CLUBS[(CLUBS.findIndex(x=>x.name===S.club)+1)%CLUBS.length];return `<div class="match"><div class="club"><span class="muted small">HOME</span><strong>${esc(S.club)}</strong></div><div class="score">VS</div><div class="club"><span class="muted small">AWAY</span><strong>${esc(opp.name)}</strong></div></div><hr><div class="actions"><button class="btn primary match-start" data-action="play">▶ 경기 시작</button><button class="btn" data-view="training">훈련하기</button></div>`}
function career(){return `<div class="grid g2"><div class="card"><h3>선수 프로필</h3><div class="row"><span>포지션</span><b>${S.player.position}</b></div><div class="row"><span>플레이 스타일</span><b>${esc(S.player.style)}</b></div><div class="row"><span>성장 배경</span><b>${esc(S.player.background)}</b></div><div class="row"><span>잠재력</span><b>${S.player.potential}</b></div><div class="row"><span>계약</span><b>${S.contract}년</b></div><div class="row"><span>주급</span><b>€${S.wage.toFixed(1)}M/년</b></div></div><div class="card"><h3>세부 능력치</h3>${statsHTML()}</div></div><div class="card" style="margin-top:14px"><h3>커리어 타임라인</h3><div class="timeline">${S.history.length?S.history.map(h=>`<div class="item"><b>${h.season} · ${esc(h.club)}</b><div class="muted">${h.apps}경기 · ${h.goals}골 · ${h.assists}도움 · 평점 ${h.rating}${h.trophy?" · 🏆 우승":""}</div></div>`).join(""):`<div class="empty">첫 시즌을 시작하면 기록이 쌓입니다.</div>`}</div></div>`}
function training(){return `<div class="grid g3">${[["technical","기술 훈련","드리블·패스 관련 능력 향상","기술 +2~4 / 체력 -12"],["physical","피지컬 훈련","속도·피지컬·체력 강화","피지컬 +2~4 / 체력 -18"],["tactical","전술 훈련","시야·판단·포지셔닝 강화","전술 +2~4 / 체력 -8"],["recovery","회복","체력과 컨디션 회복","체력 +25 / 컨디션 +8"],["individual","개인 약점 보완","현재 낮은 능력치를 집중 개선","약점 +3 / 체력 -10"],["rest","완전 휴식","멘탈과 컨디션 회복","체력 +35 / 컨디션 +5"]].map(x=>`<div class="card"><h3>${x[1]}</h3><p class="muted small">${x[2]}</p><p class="small">${x[3]}</p><button class="btn primary" data-action="train" data-value="${x[0]}">실행</button></div>`).join("")}</div><div class="notice" style="margin-top:14px">훈련은 주간 단위로 진행됩니다. 체력이 낮으면 경기 출전 가능성과 경기력이 떨어질 수 있습니다.</div>`}
function match(){const c=CLUBS.find(x=>x.name===S.club);return `<div class="match-hero"><div class="eyebrow">MATCH DAY ${S.week}</div><h2>${S.season} 시즌 · ${S.week}주차</h2><p class="muted">오늘의 경기에 출전해 커리어를 쌓아보세요.</p>${matchCard(c)}</div><div class="grid g3" style="margin-top:14px"><div class="card"><span class="muted small">컨디션</span><div class="metric">${S.form}%</div></div><div class="card"><span class="muted small">체력</span><div class="metric">${S.energy}%</div></div><div class="card"><span class="muted small">감독 신뢰도</span><div class="metric">${S.trust}%</div></div></div>`}
function club(){const c=CLUBS.find(x=>x.name===S.club);return `<div class="grid g3"><div class="card"><h3>현재 구단</h3><div class="metric">${esc(c.name)}</div><div class="muted">${c.league} · 전력 ${c.strength}</div></div><div class="card"><h3>팀 내 입지</h3><div class="metric">${S.trust>75?"핵심 주전":S.trust>55?"로테이션":"경쟁자"}</div><div class="muted">감독 신뢰도 ${S.trust}%</div></div><div class="card"><h3>시즌 진행</h3><div class="metric">${S.week}/34</div><div class="muted">계약 잔여 ${S.contract}년</div></div></div><div class="card" style="margin-top:14px"><h3>구단 스쿼드 개요</h3><table class="table"><tr><th>선수 역할</th><th>예상 비중</th><th>상태</th></tr><tr><td>당신</td><td>${S.trust}%</td><td>${S.trust>70?"주전":"경쟁"}</td></tr><tr><td>팀 평균</td><td>${c.strength}</td><td>정상</td></tr></table></div>`}
function transfer(){const d=derived(S);const offers=CLUBS.filter(c=>c.name!==S.club&&c.strength<=d.ovr+18).sort((a,b)=>b.strength-a.strength).slice(0,5);return `<div class="card"><h3>이적시장</h3><p class="muted small">현재 OVR ${d.ovr}, 시장가치 €${S.value.toFixed(1)}M를 기준으로 관심 구단이 생성됩니다.</p>${offers.map((c,i)=>`<div class="row"><div><b>${esc(c.name)}</b><div class="muted small">${c.league} · 팀 전력 ${c.strength} · 예상 관심도 ${Math.max(18,Math.min(94,50+(d.ovr-c.strength)*2))}%</div></div><button class="btn" data-action="transfer" data-value="${esc(c.name)}">제안 수락</button></div>`).join("")}</div>`}
function national(){const d=derived(S);const eligible=d.ovr>=72;return `<div class="hero"><h2>🇰🇷 국가대표</h2><p class="muted">대표팀은 현재 능력치, 포지션, 최근 경기력과 나이를 종합해 가상으로 선발됩니다.</p><div class="metric">${eligible?"A매치 소집 경쟁":"소집 기준 미달"}</div><p>${eligible?`예상 출전 기회: ${Math.round((d.ovr-65)*4+Math.random()*20)}%`:"클럽에서 경기력을 더 쌓아보세요."}</p></div><div class="grid g3" style="margin-top:14px">${[["A매치 출전",S.national.caps],["대표팀 골",S.national.goals],["대표팀 상태",eligible?"관찰 대상":"대기"]].map(x=>`<div class="card"><div class="muted small">${x[0]}</div><div class="metric">${x[1]}</div></div>`).join("")}</div>`}
function records(){return `<div class="notice" style="margin-bottom:14px">경기를 진행할수록 기록이 쌓입니다. 복잡한 메뉴 대신 이곳에서 커리어의 핵심 결과만 확인하세요.</div><div class="grid g4">${[["통산 경기",S.career.apps],["통산 골",S.career.goals],["통산 도움",S.career.assists],["통산 우승",S.career.trophies]].map(x=>`<div class="card"><div class="muted small">${x[0]}</div><div class="metric">${x[1]}</div></div>`).join("")}</div><div class="card" style="margin-top:14px"><h3>시즌별 기록</h3>${S.history.length?`<table class="table"><tr><th>시즌</th><th>구단</th><th>경기</th><th>골</th><th>도움</th><th>평점</th></tr>${S.history.map(h=>`<tr><td>${h.season}</td><td>${esc(h.club)}</td><td>${h.apps}</td><td>${h.goals}</td><td>${h.assists}</td><td>${h.rating}</td></tr>`).join("")}</table>`:`<div class="empty">시즌 기록이 없습니다.</div>`}</div>`}
function hall(){return `<div class="hero"><div class="eyebrow">HALL OF FAME</div><h2>${esc(S.player.name)}</h2><p class="muted">한 선수의 인생이 끝날 때까지 우승, 개인상, 국가대표 기록이 누적됩니다.</p></div><div class="card" style="margin-top:14px"><h3>수상/업적</h3>${S.awards.length?S.awards.map(a=>`<div class="row"><span>🏆 ${esc(a)}</span></div>`).join(""):`<div class="empty">아직 등록된 수상 기록이 없습니다.</div>`}</div>`}
function newView(){return `<div class="grid g2"><div class="card"><h2>새로운 축구 인생</h2><div class="form"><div class="field"><label>선수 이름</label><input id="name" value="신인 선수"></div><div class="field"><label>국적</label><input id="nation" value="대한민국"></div><div class="field"><label>포지션</label><select id="position">${Object.keys(POSITIONS).map(p=>`<option>${p}</option>`).join("")}</select></div><div class="field"><label>주발</label><select id="foot"><option>오른발</option><option>왼발</option><option>양발</option></select></div><div class="field"><label>플레이 스타일</label><select id="style">${STYLES.map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>성장 배경</label><select id="background">${BACKGROUNDS.map(x=>`<option>${x}</option>`).join("")}</select></div><div class="field"><label>시작 구단</label><select id="club">${CLUBS.slice(0,8).map(c=>`<option>${c.name}</option>`).join("")}</select></div><button class="btn primary" id="start">START CAREER</button></div></div><div class="card"><h3>플레이 방법</h3><div class="list">${["경기 시작으로 매주 경기를 진행","훈련으로 능력치와 컨디션 관리","경기와 훈련 결과에 따라 성장","기록에서 내 커리어 확인"].map(x=>`<div class="row"><span>✓ ${x}</span></div>`).join("")}</div></div></div>`}
function eventModal(){if(!S.event)return "";const e=S.event;return `<div style="position:fixed;inset:0;background:#0009;display:grid;place-items:center;z-index:10"><div class="card" style="max-width:520px;width:calc(100% - 30px)"><div class="eyebrow">LIFE EVENT</div><h2>${esc(e.title)}</h2><p class="muted">${esc(e.text)}</p>${e.a.map((x,i)=>`<button class="btn event-option" data-action="event" data-value="${i}">${x}</button>`).join("")}</div></div>`}
function render(){if(!S.started&&view!=="new")view="new";let body=view==="new"?newView():({dashboard:()=>dashboard(),career:()=>career(),match:()=>match(),training:()=>training(),club:()=>club(),transfer:()=>transfer(),national:()=>national(),records:()=>records(),hall:()=>hall()}[view]||dashboard)();shell(body,view==="new"?"NEW FOOTBALL LIFE":({dashboard:"커리어 홈",career:"내 선수",match:"MATCH DAY",training:"훈련",club:"구단",transfer:"이적시장",national:"국가대표",records:"커리어 기록",hall:"명예의 전당"}[view]));app.insertAdjacentHTML("beforeend",eventModal());const st=document.querySelector("#start");if(st)st.onclick=start}
function start(){S=newPlayer({name:document.querySelector("#name").value,nation:document.querySelector("#nation").value,position:document.querySelector("#position").value,foot:document.querySelector("#foot").value,style:document.querySelector("#style").value,background:document.querySelector("#background").value,club:document.querySelector("#club").value});save(S);view="dashboard";toast("축구 인생이 시작되었습니다.");render()}
function showMatchLoading(){const opp=CLUBS[(CLUBS.findIndex(x=>x.name===S.club)+S.week)%CLUBS.length];const overlay=document.createElement("div");overlay.className="match-loading";overlay.innerHTML=`<div class="loading-card"><div class="loading-ball">⚽</div><div class="eyebrow">MATCH DAY</div><h2>경기중<span class="dots">...</span></h2><div class="loading-match"><strong>${esc(S.club)}</strong><span>VS</span><strong>${esc(opp.name)}</strong></div><div class="loading-bar"><i></i></div><p class="muted">경기 결과를 시뮬레이션하고 있습니다</p></div>`;document.body.appendChild(overlay);setTimeout(()=>overlay.querySelector("h2").innerHTML="후반전 진행 중<span class="dots">...</span>",1200);setTimeout(()=>overlay.querySelector("h2").innerHTML="경기 종료 처리 중<span class="dots">...</span>",2200);}
function action(type,value){
 if(type==="play"){if(S.energy<20){toast("체력이 너무 낮습니다. 먼저 회복하세요.");return} if(window.matchRunning)return; window.matchRunning=true; showMatchLoading(); setTimeout(()=>{const opp=CLUBS[(CLUBS.findIndex(x=>x.name===S.club)+S.week)%CLUBS.length];const d=derived(S);const chance=Math.max(.05,Math.min(.95,.5+(d.ovr-opp.strength)/70+(S.form-65)/250));const win=Math.random()<chance;const scored=S.player.position==="GK"?false:Math.random()<Math.max(.08,Math.min(.7,(d.ovr-45)/100));const assist=!scored&&Math.random()<.12;S.energy=Math.max(0,S.energy-18);S.form=Math.max(35,Math.min(100,S.form+(win?4:-2)+(scored?5:0)));S.trust=Math.max(10,Math.min(95,S.trust+(win?3:-2)+(scored?4:0)));S.career.apps++;S.career.minutes+=90;if(scored)S.career.goals++;if(assist)S.career.assists++;S.career.rating+=6.3+(win?1:0)+(scored?.8:0);S.stats[S.player.position==="ST"?"FIN":"PAS"]=Math.min(S.player.potential,S.stats[S.player.position==="ST"?"FIN":"PAS"]+(Math.random()<.35?1:0));S.news.unshift(`${S.season}시즌 ${S.week}주차: ${win?"승리":"경기 종료"} · ${scored?"득점 기록":"개인 기록 없음"} · 상대 ${opp.name}`);const r=advanceWeek(S);if(Math.random()<.22&&!S.event)S.event=EVENTS[Math.floor(Math.random()*EVENTS.length)];save(S);window.matchRunning=false;render();toast(r.seasonEnd?"시즌이 종료되었습니다!":"경기 결과가 기록되었습니다.");},2600); return}
 if(type==="train"){const m={technical:["DRI", "CON","PAS"],physical:["PAC","ACC","PHY","STA"],tactical:["VIS","MEN","POS"],individual:null,recovery:null,rest:null}[value];if(value==="recovery"){S.energy=Math.min(100,S.energy+25);S.form=Math.min(100,S.form+8)}else if(value==="rest"){S.energy=Math.min(100,S.energy+35);S.form=Math.min(100,S.form+5);S.morale=Math.min(100,S.morale+4)}else{S.energy=Math.max(0,S.energy-(value==="physical"?18:value==="tactical"?8:10));if(value==="individual"){const k=Object.entries(S.stats).sort((a,b)=>a[1]-b[1])[0][0];S.stats[k]=Math.min(S.player.potential,S.stats[k]+3)}else m.forEach(k=>S.stats[k]=Math.min(S.player.potential,S.stats[k]+2+Math.floor(Math.random()*3)));S.form=Math.max(30,S.form+1)}advanceWeek(S);if(Math.random()<.12&&!S.event)S.event=EVENTS[Math.floor(Math.random()*EVENTS.length)];save(S);toast("훈련 결과가 반영되었습니다.");render();return}
 if(type==="transfer"){S.club=value;S.trust=55;S.contract=3;S.value=Math.round((S.value*1.25+2)*10)/10;S.news.unshift(`${S.season}시즌 ${value}로 이적했습니다.`);save(S);toast(`${value}(으)로 이적했습니다.`);render();return}
 if(type==="event"){const i=Number(value);S.event=null;if(i===0){S.trust+=3;S.stats.POS=Math.min(S.player.potential,(S.stats.POS||50)+2)}if(i===1){S.stats.MEN=Math.min(S.player.potential,(S.stats.MEN||50)+2);S.value+=.4}if(i===2){const k=Object.entries(S.stats).sort((a,b)=>a[1]-b[1])[0][0];S.stats[k]=Math.min(S.player.potential,S.stats[k]+4)}if(i===3){S.morale=Math.min(100,S.morale+6);S.form=Math.min(100,S.form+3)}save(S);render()}
}
render();