const KEY = "geii-notes-v1";
const data = {
 s1: {
  title:"Semestre 1",
  ues:[
   {id:"ue11",code:"UE 1.1",name:"Concevoir la partie GEII d’un système"},
   {id:"ue12",code:"UE 1.2",name:"Vérifier la partie GEII d’un système"}
  ],
  subjects:[
   {id:"r101",code:"R101",name:"Anglais",w:[.5,.5]},
   {id:"r102",code:"R102",name:"Culture et communication",w:[.5,.5]},
   {id:"r103",code:"R103",name:"Vie de l’entreprise",w:[.25,.25]},
   {id:"r104",code:"R104",name:"Outils mathématiques et logiciels",w:[1.25,1.25]},
   {id:"r105",code:"R105",name:"Projet Personnel et Professionnel",w:[.5,.5]},
   {id:"r106",code:"R106",name:"Intégration à l’Université",w:[.5,.5]},
   {id:"r107",code:"R107",name:"Automatisme",w:[1.25,1.25]},
   {id:"r108",code:"R108",name:"Informatique",w:[1.25,1.25]},
   {id:"r109",code:"R109",name:"Électronique",w:[1.25,1.25]},
   {id:"r110",code:"R110",name:"Énergie",w:[1.25,1.25]},
   {id:"r111",code:"R111",name:"Physique appliquée",w:[.5,.5]},
   {id:"sae101",code:"SAÉ 101",name:"SAÉ 101",w:[5,0]},
   {id:"sae102",code:"SAÉ 102",name:"SAÉ 102",w:[0,5]},
   {id:"portfolio1",code:"Portfolio",name:"SAÉ Portfolio (S1)",w:[1,1]}
  ]
 },
 s2:{
  title:"Semestre 2",
  ues:[
   {id:"ue21",code:"UE 2.1",name:"Concevoir la partie GEII d’un système"},
   {id:"ue22",code:"UE 2.2",name:"Vérifier la partie GEII d’un système"}
  ],
  subjects:[
   {id:"r201",code:"R201",name:"Choix langue (anglais ou allemand)",w:[.5,.5]},
   {id:"r202",code:"R202",name:"Culture et communication",w:[.5,.5]},
   {id:"r203",code:"R203",name:"Vie de l’entreprise",w:[.5,.5]},
   {id:"r204",code:"R204",name:"Outils mathématiques et logiciels",w:[1.3,1.3]},
   {id:"r205",code:"R205",name:"Projet Personnel et Professionnel",w:[.5,.5]},
   {id:"r206",code:"R206",name:"Automatisme",w:[1.3,1.3]},
   {id:"r207",code:"R207",name:"Informatique embarquée",w:[1.3,1.3]},
   {id:"r208",code:"R208",name:"Électronique",w:[1.3,1.3]},
   {id:"r209",code:"R209",name:"Énergie",w:[1.3,1.3]},
   {id:"r210",code:"R210",name:"Physique appliquée",w:[.5,.5]},
   {id:"sae201",code:"SAÉ 201",name:"SAÉ 201",w:[5,0]},
   {id:"sae202",code:"SAÉ 202",name:"SAÉ 202",w:[0,5]},
   {id:"portfolio2",code:"Portfolio",name:"SAÉ Portfolio (S2)",w:[1,1]}
  ]
 }
};
let current = "s1";
let grades = load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return {}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(grades));document.getElementById("saveState").innerHTML='<span class="dot"></span> Sauvegarde locale activée'}catch{document.getElementById("saveState").textContent="Stockage indisponible"}}
function fmt(n){return n.toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})}
function val(id){const v=grades[id];return v===""||v===undefined||v===null?null:Number(v)}
function calculate(sem,ui){
 let total=0,used=0,complete=true;
 sem.subjects.forEach(s=>{const w=s.w[ui],v=val(s.id);if(w>0){if(v===null){complete=false}else{total+=v*w;used+=w}}});
 return {note:used?total/used:null,complete,used};
}
function render(){
 const sem=data[current];document.getElementById("semesterTitle").textContent=sem.title;
 document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.semester===current));
 document.getElementById("summary").innerHTML=sem.ues.map((ue,i)=>{
  const c=calculate(sem,i),n=c.note;
  const status=n===null?'<span class="status">En attente</span>':c.complete?(n>=10?'<span class="status ok">Moyenne ≥ 10</span>':'<span class="status pending">Moyenne &lt; 10</span>'):'<span class="status pending">Partiel</span>';
  return `<article class="ue-card"><div class="ue-top"><div><div class="ue-code">${ue.code}</div><h3>${ue.name}</h3></div>${status}</div><div class="ue-score">${n===null?'--':fmt(n)} <span>/ 20</span></div><div class="progress"><span style="width:${n===null?0:Math.max(0,Math.min(100,n/20*100))}%"></span></div><div class="card-foot"><span>${c.complete?'Toutes les moyennes sont saisies':`${c.used>0?'Calcul provisoire · ':''}Notes à compléter`}</span><span>Coefficients : ${sem.subjects.reduce((a,s)=>a+s.w[i],0).toLocaleString('fr-FR')}</span></div></article>`
 }).join("");
 document.getElementById("subjects").innerHTML=sem.subjects.map(s=>{
  const v=grades[s.id]??"";
  const coeffText=s.w.map((w,i)=>w?`${sem.ues[i].code} : ${w.toLocaleString("fr-FR")}`:null).filter(Boolean).join(" · ");
  return `<div class="subject-row"><div><div class="subject-name">${s.name}</div><div class="subject-code">${s.code} · ${coeffText}</div></div><div class="grade-wrap"><input class="grade-input" type="number" min="0" max="20" step="0.01" inputmode="decimal" placeholder="-- / 20" aria-label="Moyenne ${s.name}" data-grade="${s.id}" value="${v}"></div><div class="weight">Sur 20</div></div>`
 }).join("");
 document.querySelectorAll("[data-grade]").forEach(input=>input.addEventListener("input",e=>{
  const el=e.target,id=el.dataset.grade,raw=el.value.replace(",",".");
  if(raw==="" ){delete grades[id];el.classList.remove("invalid")}
  else if(Number(raw)>=0&&Number(raw)<=20){grades[id]=Number(raw);el.classList.remove("invalid")}
  else{el.classList.add("invalid");return}
  save();renderSummaryOnly();
 }));
}
function renderSummaryOnly(){
 const sem=data[current];
 document.getElementById("summary").innerHTML=sem.ues.map((ue,i)=>{
  const c=calculate(sem,i),n=c.note;
  const status=n===null?'<span class="status">En attente</span>':c.complete?(n>=10?'<span class="status ok">Moyenne ≥ 10</span>':'<span class="status pending">Moyenne &lt; 10</span>'):'<span class="status pending">Partiel</span>';
  return `<article class="ue-card"><div class="ue-top"><div><div class="ue-code">${ue.code}</div><h3>${ue.name}</h3></div>${status}</div><div class="ue-score">${n===null?'--':fmt(n)} <span>/ 20</span></div><div class="progress"><span style="width:${n===null?0:Math.max(0,Math.min(100,n/20*100))}%"></span></div><div class="card-foot"><span>${c.complete?'Toutes les moyennes sont saisies':`${c.used>0?'Calcul provisoire · ':''}Notes à compléter`}</span><span>Coefficients : ${sem.subjects.reduce((a,s)=>a+s.w[i],0).toLocaleString('fr-FR')}</span></div></article>`
 }).join("");
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{current=b.dataset.semester;render()}));
document.getElementById("exportBtn").addEventListener("click",()=>{
 const blob=new Blob([JSON.stringify({app:"Calculateur GEII",version:1,grades},null,2)],{type:"application/json"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="mes-notes-geii.json";a.click();URL.revokeObjectURL(a.href);toast("Export prêt !");
});
document.getElementById("importFile").addEventListener("change",async e=>{
 const file=e.target.files[0];if(!file)return;
 try{const obj=JSON.parse(await file.text());const incoming=obj.grades||obj;if(typeof incoming!=="object"||Array.isArray(incoming))throw Error();grades={};for(const [k,v] of Object.entries(incoming)){if(v===""||v===null)continue;const n=Number(v);if(Number.isFinite(n)&&n>=0&&n<=20)grades[k]=n}save();render();toast("Notes importées.");}
 catch{toast("Fichier invalide.");}e.target.value="";
});
document.getElementById("resetBtn").addEventListener("click",()=>{if(confirm("Effacer toutes les notes enregistrées sur ce navigateur ? Cette action est irréversible.")){grades={};save();render();toast("Toutes les notes ont été effacées.")}});
let toastTimer;function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2300)}
render();
