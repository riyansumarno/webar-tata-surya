'use strict';
(() => {
  const D = window.SOLAR_DATA;
  const P = D.planets;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const fmt = new Intl.NumberFormat('id-ID');
  const STORE_KEY = 'lab-antariksa-progress-v7';
  const freshProgress = () => ({points:0,lessons:[],planets:[],missions:[],bestQuiz:null,compareCount:0,orbitDone:false,quizDone:false,visits:0});
  let progress = loadProgress();
  let route = 'home';
  let sound = true;
  let toastTimer;
  let orbitT = 0, orbitSpeed = 1, orbitPaused = false, showLabels = true, exploreFilter='all';
  let lessonIndex = 0;
  let selectedPlanet = null;
  let planetHitAreas = [];
  let quizState = null;
  let expYear = {running:false,days:0,planet:P[2],last:performance.now()};
  let lastFrame = performance.now();

  function loadProgress(){
    const base=freshProgress();
    try { const raw=JSON.parse(localStorage.getItem(STORE_KEY)||'{}'); return {...base,...raw,lessons:Array.isArray(raw.lessons)?raw.lessons:[],planets:Array.isArray(raw.planets)?raw.planets:[],missions:Array.isArray(raw.missions)?raw.missions:[]}; }
    catch { return base; }
  }
  function saveProgress(){ try{localStorage.setItem(STORE_KEY, JSON.stringify(progress));}catch{} updateProgressUI(); }
  function addPoints(n, reason){
    progress.points += n; saveProgress(); if(reason) toast(`+${n} poin • ${reason}`); beep(620,.045);
  }
  function completeMission(id){
    if(progress.missions.includes(id)) return;
    const m = D.missions.find(x=>x.id===id); if(!m) return;
    progress.missions.push(id); progress.points += m.reward; saveProgress(); toast(`Misi selesai: ${m.title} • +${m.reward} poin`); beep(760,.08);
  }
  function visitPlanet(id){
    if(!progress.planets.includes(id)){ progress.planets.push(id); addPoints(5,'Planet baru dijelajahi'); }
    if(id==='jupiter') completeMission('m1');
    if(id==='saturn') completeMission('m2');
  }
  function beep(freq=520,dur=.04){
    if(!sound) return;
    try { const C=window.AudioContext||window.webkitAudioContext; if(!C)return; const c=new C(),o=c.createOscillator(),g=c.createGain(); o.frequency.value=freq; g.gain.setValueAtTime(.025,c.currentTime); g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur); o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+dur);setTimeout(()=>c.close(),dur*1000+80);} catch{}
  }
  function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600); }

  function navigate(name){
    if(!document.querySelector(`[data-screen="${name}"]`)) name='home';
    route=name;
    $$('[data-screen]').forEach(s=>s.classList.toggle('active',s.dataset.screen===name));
    $$('.bottom-nav [data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===name));
    window.scrollTo({top:0,behavior:'instant'});
    try{history.replaceState(null,'',name==='home' ? location.pathname : `#${name}`);}catch{}
    if(name==='learn') renderLesson();
    if(name==='missions') renderMissions();
    if(name==='progress') updateProgressUI();
    if(name==='sources') renderSources();
    if(name==='experiment') syncExperiments();
    if(name==='explore') setTimeout(resizeCanvases,30);
  }
  document.addEventListener('click', e=>{
    const r=e.target.closest('[data-route]'); if(r){ e.preventDefault(); navigate(r.dataset.route); }
  });
  window.addEventListener('hashchange',()=>navigate(location.hash.replace('#','')||'home'));

  $('#soundToggle').addEventListener('click',()=>{sound=!sound;$('#soundToggle').textContent=sound?'🔊':'🔇';toast(sound?'Suara aktif':'Suara dimatikan')});
  $('#nextFact').addEventListener('click',()=>{ const facts=[
    'Tata Surya memiliki delapan planet utama.',
    'Empat planet terdekat dengan Matahari memiliki permukaan padat berbatu.',
    'Jupiter adalah planet terbesar di Tata Surya.',
    'Uranus dan Neptunus termasuk raksasa es.',
    'Merkurius menyelesaikan satu revolusi sekitar 88 hari Bumi.',
    'Visualisasi pendidikan biasanya tidak memakai skala jarak dan ukuran secara bersamaan.'
  ]; const el=$('#quickFact'); let idx=facts.indexOf(el.textContent); el.textContent=facts[(idx+1)%facts.length]; beep(); });

  // lessons
  function initLessons(){
    const nav=$('#lessonNav'); nav.innerHTML=D.lessons.map((l,i)=>`<button class="lesson-step" data-lesson="${i}"><b>${l.eyebrow}</b>${l.title}</button>`).join('');
    nav.addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(!b)return;lessonIndex=+b.dataset.lesson;renderLesson();});
    $('#lessonPrev').addEventListener('click',()=>{lessonIndex=Math.max(0,lessonIndex-1);renderLesson();});
    $('#lessonNext').addEventListener('click',()=>{
      if(!progress.lessons.includes(lessonIndex)){progress.lessons.push(lessonIndex);addPoints(10,'Langkah belajar selesai');}
      if(lessonIndex<D.lessons.length-1){lessonIndex++;renderLesson();} else {toast('Materi terbimbing selesai. Lanjutkan ke Jelajah 3D.');navigate('explore');}
    });
  }
  function renderLesson(){
    const l=D.lessons[lessonIndex]; if(!l)return;
    $('#lessonCount').textContent=lessonIndex+1;$('#lessonEyebrow').textContent=l.eyebrow;$('#lessonTitle').textContent=l.title;$('#lessonBody').textContent=l.body;$('#lessonTask').textContent=l.task;$('#lessonPrev').disabled=lessonIndex===0;$('#lessonNext').textContent=lessonIndex===D.lessons.length-1?'Selesai & Jelajah →':'Lanjut →';
    $$('.lesson-step').forEach((b,i)=>{b.classList.toggle('active',i===lessonIndex);b.classList.toggle('done',progress.lessons.includes(i));});
    const hints=['Delapan planet mengorbit Matahari','Planet dalam disorot','Planet luar disorot','Perhatikan gerak orbit','Ukuran visual disederhanakan'];$('#lessonHint').textContent=hints[lessonIndex];
  }

  // Canvas utilities
  function fitCanvas(c){
    const r=c.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2); const w=Math.max(1,Math.round(r.width*d)),h=Math.max(1,Math.round(r.height*d)); if(c.width!==w||c.height!==h){c.width=w;c.height=h;} return {ctx:c.getContext('2d'),w,h,d};
  }
  function drawBackground(ctx,w,h,stars=true){
    const g=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.45,Math.max(w,h)*.7);g.addColorStop(0,'#102a4c');g.addColorStop(1,'#030812');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    if(stars){ctx.fillStyle='rgba(255,255,255,.65)';for(let i=0;i<90;i++){const x=(i*137.4%997)/997*w,y=(i*73.1%991)/991*h,r=(i%7===0?1.5:.7);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}}
  }
  function drawSun(ctx,x,y,r){const g=ctx.createRadialGradient(x-r*.25,y-r*.25,r*.05,x,y,r);g.addColorStop(0,'#fff8c8');g.addColorStop(.42,'#ffd652');g.addColorStop(1,'#ff8a00');ctx.save();ctx.shadowColor='rgba(255,178,38,.65)';ctx.shadowBlur=r*.9;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawPlanet(ctx,p,x,y,r,label=true){ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=r*.7;const g=ctx.createRadialGradient(x-r*.3,y-r*.35,r*.08,x,y,r);g.addColorStop(0,p.accent);g.addColorStop(.72,p.color);g.addColorStop(1,'#182033');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(p.id==='saturn'){ctx.strokeStyle='rgba(245,223,166,.9)';ctx.lineWidth=Math.max(2,r*.15);ctx.beginPath();ctx.ellipse(x,y,r*1.65,r*.48,-.18,0,Math.PI*2);ctx.stroke();}if(label){ctx.font=`700 ${Math.max(11,r*.45)}px system-ui`;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.shadowColor='#000';ctx.shadowBlur=4;ctx.fillText(p.name,x,y-r-9);ctx.shadowBlur=0;}ctx.restore();}
  function orbitRadius(index,maxR){const fractions=[.20,.27,.34,.41,.52,.63,.74,.84];return maxR*fractions[index];}
  function drawSolarSystem(c,{filter='all',labels=true,time=orbitT,lessonFocus=null,hit=false}={}){
    const {ctx,w,h,d}=fitCanvas(c);drawBackground(ctx,w,h,true);const cx=w*.5,cy=h*.52,maxR=Math.min(w*.46,h*.75);drawSun(ctx,cx,cy,Math.max(15,maxR*.055));const hits=[];
    P.forEach((p,i)=>{const include=filter==='all'||(filter==='inner'&&p.group==='Dalam')||(filter==='outer'&&p.group==='Luar');const emphasis=!lessonFocus||lessonFocus==='all'||(lessonFocus==='inner'&&p.group==='Dalam')||(lessonFocus==='outer'&&p.group==='Luar')||lessonFocus==='motion'||lessonFocus==='scale';const rr=orbitRadius(i,maxR);ctx.strokeStyle=include&&emphasis?'rgba(170,202,255,.22)':'rgba(140,160,190,.07)';ctx.lineWidth=d;ctx.beginPath();ctx.ellipse(cx,cy,rr,rr*.31,0,0,Math.PI*2);ctx.stroke();if(!include)return;const periodScale=Math.sqrt(p.orbitDays/88);const a=time/(periodScale*3.2)+i*.78;const x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*.31;let pr=Math.max(4.5,Math.min(maxR*.055,7*d + Math.log10(p.diameter/4500+1)*4*d));if(lessonFocus==='scale')pr=Math.max(4,p.sizeEarth*4.3*d);drawPlanet(ctx,p,x,y,pr,labels&&emphasis);if(hit)hits.push({p,x,y,r:Math.max(18*d,pr*1.6)});});return hits;
  }

  function drawLesson(){ const c=$('#lessonCanvas'); if(!c)return; drawSolarSystem(c,{labels:true,time:orbitT*.75,lessonFocus:D.lessons[lessonIndex]?.focus}); }

  function drawExplore(){ const c=$('#spaceCanvas'); if(!c)return;planetHitAreas=drawSolarSystem(c,{filter:exploreFilter,labels:showLabels,time:orbitT,hit:true}); }
  $('#spaceCanvas').addEventListener('pointerup',e=>{const c=e.currentTarget,r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),x=(e.clientX-r.left)*d,y=(e.clientY-r.top)*d;const hit=planetHitAreas.slice().reverse().find(h=>Math.hypot(x-h.x,y-h.y)<=h.r);if(hit)openPlanet(hit.p);});
  function openPlanet(p){ selectedPlanet=p;visitPlanet(p.id);$('#planetBadge').textContent=`PLANET KE-${p.order} • ${p.group.toUpperCase()}`;$('#planetType').textContent=p.type;$('#planetName').textContent=p.name;$('#planetFact').textContent=p.fact;$('#planetBall').style.background=`radial-gradient(circle at 30% 25%,${p.accent},${p.color} 65%,#101725)`;$('#planetStats').innerHTML=`<div class="stat"><small>Diameter</small><b>${fmt.format(p.diameter)} km</b></div><div class="stat"><small>Jarak rata-rata</small><b>${fmt.format(p.distance)} juta km</b></div><div class="stat"><small>1 tahun</small><b>${formatPeriod(p.orbitDays)}</b></div><div class="stat"><small>Rotasi</small><b>${p.rotation}</b></div>`;$('#planetSheet').classList.add('open');$('#exploreTitle').textContent=p.name;}
  function formatPeriod(days){if(days<1000)return `${fmt.format(Math.round(days))} hari Bumi`;return `${(days/365.25).toFixed(days>20000?0:1).replace('.',',')} tahun Bumi`;}
  $('#sheetClose').addEventListener('click',()=>{$('#planetSheet').classList.remove('open');$('#exploreTitle').textContent='Tata Surya';});
  $('#pauseOrbit').addEventListener('click',()=>{orbitPaused=!orbitPaused;$('#pauseOrbit').textContent=orbitPaused?'▶':'⏸';});
  $('#orbitSpeed').addEventListener('input',e=>{orbitSpeed=+e.target.value;$('#orbitSpeedText').textContent=`${orbitSpeed.toFixed(orbitSpeed%1?1:0)}×`;});
  $('#toggleLabels').addEventListener('click',()=>{showLabels=!showLabels;$('#toggleLabels').classList.toggle('active',showLabels);});
  $$('.tool[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('.tool[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');exploreFilter=b.dataset.filter;}));
  $('#exploreHelp').addEventListener('click',()=>showModal('<span class="eyebrow">CARA MENJELAJAH</span><h2>Sentuh planet untuk membuka profil.</h2><p>Gunakan filter Planet Dalam/Luar, ubah kecepatan waktu, dan nonaktifkan label jika ingin fokus pada visual. Ukuran dan jarak pada tampilan ini disederhanakan agar semua planet terlihat.</p>'));
  $('#compareThis').addEventListener('click',()=>{if(!selectedPlanet)return;navigate('experiment');setExperiment('compare');$('#compareA').value=selectedPlanet.id;$('#compareB').value=selectedPlanet.id==='earth'?'jupiter':'earth';doCompare(true);});
  $('#planetChallenge').addEventListener('click',()=>{if(!selectedPlanet)return;const p=selectedPlanet;showModal(`<span class="eyebrow">TEBAK CEPAT</span><h2>${p.clue}</h2><p>Planet apakah aku?</p><div class="row-actions"><button class="btn primary" id="revealPlanet">Tampilkan jawaban</button></div>`);setTimeout(()=>$('#revealPlanet')?.addEventListener('click',()=>{showModal(`<span class="eyebrow">JAWABAN</span><h2>${p.name}</h2><p>${p.fact}</p>`);}),0);});

  // experiments
  function initExperiments(){
    const options=P.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');['#orbitPlanetSelect','#scalePlanetSelect','#compareA','#compareB'].forEach(s=>$(s).innerHTML=options);$('#orbitPlanetSelect').value='mercury';$('#scalePlanetSelect').value='jupiter';$('#compareA').value='earth';$('#compareB').value='jupiter';
    $$('.tab[data-exp]').forEach(b=>b.addEventListener('click',()=>setExperiment(b.dataset.exp)));
    $('#orbitPlanetSelect').addEventListener('change',()=>{expYear.planet=P.find(p=>p.id===$('#orbitPlanetSelect').value);resetYear();});
    $('#runYear').addEventListener('click',()=>{expYear.running=!expYear.running;$('#runYear').textContent=expYear.running?'⏸ Jeda':'▶ Jalankan';});
    $('#resetYear').addEventListener('click',resetYear);
    $('#scalePlanetSelect').addEventListener('change',syncScale);
    $('#doCompare').addEventListener('click',()=>doCompare(true));
    syncScale();doCompare(false);
  }
  function setExperiment(name){$$('.tab[data-exp]').forEach(b=>b.classList.toggle('active',b.dataset.exp===name));$$('[data-exp-panel]').forEach(p=>p.classList.toggle('active',p.dataset.expPanel===name));setTimeout(resizeCanvases,20);}
  function syncExperiments(){syncScale();doCompare(false);}
  function resetYear(){expYear.running=false;expYear.days=0;expYear.planet=P.find(p=>p.id===$('#orbitPlanetSelect').value)||P[0];$('#runYear').textContent='▶ Jalankan';updateYearText();}
  function updateYearText(){const p=expYear.planet,ratio=Math.min(1,expYear.days/p.orbitDays);$('#simDay').textContent=`${Math.round(expYear.days)} hari Bumi`;$('#yearProgress').style.width=`${ratio*100}%`;if(expYear.days>=p.orbitDays){$('#orbitInsight').innerHTML=`<b>${p.name}</b> menyelesaikan satu revolusi dalam sekitar <b>${formatPeriod(p.orbitDays)}</b>. Bandingkan dengan Bumi: sekitar 365 hari.`;}else{$('#orbitInsight').textContent=`${p.name} membutuhkan sekitar ${formatPeriod(p.orbitDays)} untuk menyelesaikan satu revolusi.`;}}
  function drawYearExperiment(){const c=$('#orbitExperimentCanvas');if(!c)return;const {ctx,w,h,d}=fitCanvas(c);drawBackground(ctx,w,h);const cx=w*.5,cy=h*.48,rr=Math.min(w,h)*.33;ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=d;ctx.beginPath();ctx.ellipse(cx,cy,rr,rr*.38,0,0,Math.PI*2);ctx.stroke();drawSun(ctx,cx,cy,Math.max(14,rr*.09));const p=expYear.planet,a=(expYear.days/p.orbitDays)*Math.PI*2-Math.PI/2;drawPlanet(ctx,p,cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.38,Math.max(10,d*9),true);}
  function syncScale(){const p=P.find(x=>x.id===$('#scalePlanetSelect').value)||P[4];$('#scaleTargetName').textContent=p.name;const earth=82;const size=Math.max(20,Math.min(260,earth*p.sizeEarth));const ball=$('#scaleTargetBall');ball.style.width=`${size}px`;ball.style.height=`${size}px`;ball.style.background=`radial-gradient(circle at 30% 25%,${p.accent},${p.color} 65%,#101725)`;$('#scaleInsight').innerHTML=`Diameter ${p.name} sekitar <b>${p.sizeEarth.toFixed(2).replace('.',',')}× diameter Bumi</b>. Visual ini membandingkan diameter relatif, bukan jarak dari Matahari.`;}
  function doCompare(userAction=false){const a=P.find(x=>x.id===$('#compareA').value)||P[2],b=P.find(x=>x.id===$('#compareB').value)||P[4];$('#compareBoard').innerHTML=`<table class="compare-table"><thead><tr><th>Atribut</th><th>${a.name}</th><th>${b.name}</th></tr></thead><tbody><tr><td>Kelompok</td><td>${a.type}</td><td>${b.type}</td></tr><tr><td>Diameter</td><td>${fmt.format(a.diameter)} km</td><td>${fmt.format(b.diameter)} km</td></tr><tr><td>Jarak rata-rata</td><td>${fmt.format(a.distance)} juta km</td><td>${fmt.format(b.distance)} juta km</td></tr><tr><td>Periode revolusi</td><td>${formatPeriod(a.orbitDays)}</td><td>${formatPeriod(b.orbitDays)}</td></tr><tr><td>Rotasi</td><td>${a.rotation}</td><td>${b.rotation}</td></tr></tbody></table>`;if(userAction){progress.compareCount++;saveProgress();completeMission('m3');}}

  // missions
  function renderMissions(){
    $('#missionPoints').textContent=progress.points;$('#missionList').innerHTML=D.missions.map((m,i)=>{const done=progress.missions.includes(m.id);return `<article class="mission-card ${done?'done':''}"><div class="mission-index">${done?'✓':String(i+1).padStart(2,'0')}</div><div><h3>${m.title}</h3><p>${m.desc}</p></div><div class="mission-reward">${done?'Selesai':`+${m.reward} ⭐`}</div></article>`;}).join('');
  }

  // quiz
  function startQuiz(){quizState={index:0,score:0,answered:false,questions:[...D.quiz]};$('#quizIntro').hidden=true;$('#quizResult').hidden=true;$('#quizBox').hidden=false;renderQuestion();}
  function renderQuestion(){const s=quizState,q=s.questions[s.index];s.answered=false;$('#quizNumber').textContent=`Soal ${s.index+1}/${s.questions.length}`;$('#quizScore').textContent=s.score;$('#quizProgress').style.width=`${(s.index/s.questions.length)*100}%`;$('#quizQuestion').textContent=q.q;$('#quizFeedback').hidden=true;$('#nextQuestion').hidden=true;$('#quizChoices').innerHTML=q.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><b>${String.fromCharCode(65+i)}.</b> ${c}</button>`).join('');}
  $('#quizChoices').addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(!b||quizState.answered)return;quizState.answered=true;const q=quizState.questions[quizState.index],picked=+b.dataset.choice,ok=picked===q.answer;if(ok){quizState.score+=10;b.classList.add('correct');beep(720,.06);}else{b.classList.add('wrong');$(`[data-choice="${q.answer}"]`,$('#quizChoices')).classList.add('correct');beep(230,.09);}$$('.choice').forEach(x=>x.disabled=true);const f=$('#quizFeedback');f.hidden=false;f.innerHTML=`<b>${ok?'Benar.':'Belum tepat.'}</b> ${q.why}`;$('#quizScore').textContent=quizState.score;$('#nextQuestion').hidden=false;});
  $('#nextQuestion').addEventListener('click',()=>{quizState.index++;if(quizState.index>=quizState.questions.length)finishQuiz();else renderQuestion();});
  function finishQuiz(){const score=quizState.score;$('#quizBox').hidden=true;$('#quizResult').hidden=false;const label=score>=90?'Sangat baik':score>=70?'Baik':score>=50?'Cukup':'Perlu mengulang';$('#quizResult').innerHTML=`<span class="eyebrow">HASIL KUIS</span><div class="result-score">${score}</div><h2>${label}</h2><p>Kamu menjawab ${score/10} dari 10 soal dengan benar.</p><div class="row-actions" style="justify-content:center"><button class="btn primary" id="retryQuiz">Ulangi Kuis</button><button class="btn ghost" data-route="progress">Lihat Progres</button></div>`;$('#retryQuiz').addEventListener('click',startQuiz);if(progress.bestQuiz===null||score>progress.bestQuiz){progress.bestQuiz=score;addPoints(Math.max(10,Math.round(score/5)),'Rekor kuis diperbarui');}progress.quizDone=true;saveProgress();completeMission('m5');}
  $('#startQuiz').addEventListener('click',startQuiz);

  // progress
  function calcProgress(){const lesson=progress.lessons.length/D.lessons.length,planets=progress.planets.length/P.length,missions=progress.missions.length/D.missions.length,quiz=progress.quizDone?1:0;return Math.round((lesson*.3+planets*.25+missions*.25+quiz*.2)*100);}
  function updateProgressUI(){
    const percent=calcProgress();$('#topPoints').textContent=progress.points;$('#heroProgressText').textContent=`${percent}%`;$('#heroProgressBar').style.width=`${percent}%`;$('#progressPercent').textContent=percent;$('#progressRing').style.background=`conic-gradient(var(--cyan) ${percent*3.6}deg,rgba(255,255,255,.08) 0)`;$('#metricPoints').textContent=progress.points;$('#metricMissions').textContent=`${progress.missions.length}/5`;$('#metricQuiz').textContent=progress.bestQuiz===null?'—':progress.bestQuiz;$('#metricPlanets').textContent=`${progress.planets.length}/8`;let title='Baru mulai',desc='Mulai satu aktivitas untuk mencatat progres.';if(percent>=25){title='Penjelajah Pemula';desc='Kamu mulai memahami struktur dasar Tata Surya.';}if(percent>=50){title='Penjelajah Aktif';desc='Lebih dari separuh perjalanan pembelajaran sudah kamu tempuh.';}if(percent>=75){title='Astronom Muda';desc='Sebagian besar materi dan tantangan sudah dikuasai.';}if(percent===100){title='Master Tata Surya';desc='Seluruh aktivitas utama sudah diselesaikan.';}$('#progressTitle').textContent=title;$('#progressDesc').textContent=desc;
    const achievements=[{icon:'🌍',title:'Langkah Pertama',desc:'Selesaikan satu materi.',on:progress.lessons.length>0},{icon:'🪐',title:'Penjelajah Planet',desc:'Buka semua delapan planet.',on:progress.planets.length===8},{icon:'🚀',title:'Pemburu Misi',desc:'Selesaikan semua misi.',on:progress.missions.length===5},{icon:'🎯',title:'Nilai Tinggi',desc:'Dapatkan nilai kuis ≥ 80.',on:(progress.bestQuiz||0)>=80}];$('#badgeGrid').innerHTML=achievements.map(a=>`<div class="achievement ${a.on?'unlocked':''}"><span>${a.icon}</span><h3>${a.title}</h3><p>${a.desc}</p></div>`).join('');renderMissions();
  }
  $('#resetProgress').addEventListener('click',()=>showModal('<span class="eyebrow">RESET PROGRES</span><h2>Hapus seluruh progres di perangkat ini?</h2><p>Nilai kuis, poin, misi, dan planet yang pernah dibuka akan kembali ke awal.</p><div class="row-actions"><button class="btn primary" id="confirmReset">Ya, reset</button></div>'));

  // teacher, sources, modal
  $('#presentationMode').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{toast('Mode layar penuh tidak didukung browser ini.');}});
  function renderSources(){$('#sourceList').innerHTML=D.sources.map((s,i)=>`<article class="source-item"><div><b>${String(i+1).padStart(2,'0')} • ${s.title}</b><p>Sumber resmi NASA untuk struktur, klasifikasi, ukuran, dan lokasi planet.</p></div><a href="${s.url}" target="_blank" rel="noopener">Buka sumber ↗</a></article>`).join('');}
  function showModal(html){$('#modalContent').innerHTML=html;$('#modalBackdrop').hidden=false;}
  function closeModal(){$('#modalBackdrop').hidden=true;}
  $('#modalClose').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop'))closeModal();});
  $('#modalContent').addEventListener('click',e=>{if(e.target.id==='confirmReset'){progress=freshProgress();saveProgress();closeModal();toast('Progres telah direset.');}});

  // animation loop
  function frame(now){
    const dt=Math.min(.05,(now-lastFrame)/1000||0);lastFrame=now;if(!orbitPaused)orbitT+=dt*orbitSpeed*.72;
    if(route==='learn')drawLesson();if(route==='explore')drawExplore();if(route==='experiment'){
      if(expYear.running){expYear.days+=dt*(expYear.planet.orbitDays/8);if(expYear.days>=expYear.planet.orbitDays){expYear.days=expYear.planet.orbitDays;expYear.running=false;$('#runYear').textContent='▶ Jalankan';progress.orbitDone=true;saveProgress();completeMission('m4');}updateYearText();}
      drawYearExperiment();
    }
    requestAnimationFrame(frame);
  }
  function resizeCanvases(){['#lessonCanvas','#spaceCanvas','#orbitExperimentCanvas'].forEach(s=>{const c=$(s);if(c)fitCanvas(c);});}
  window.addEventListener('resize',resizeCanvases);

  // initialization
  initLessons();initExperiments();renderSources();updateProgressUI();
  progress.visits=(progress.visits||0)+1;saveProgress();
  navigate(location.hash.replace('#','')||'home');
  requestAnimationFrame(frame);
})();
