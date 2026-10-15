const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mediaURL=v=>{if(!v)return '';if(/^media\/[a-zA-Z0-9_./-]+$/.test(v))return v;try{const u=new URL(v);return u.protocol==='https:'?u.href:''}catch{return ''}};
const text=(s,v)=>{if($(s))$(s).textContent=v};
const config=window.MIKAL_CONTENT;
const c=config;
if(c&&Array.isArray(c.gallery)){
  const baseGallery=c.gallery.filter(g=>!/^offerta/i.test(String(g.title||'')));
  const remove=new Set([1,3,4,5,6,7,12,15,24,27,32,40]);
  const categories={2:['Styling','Reel'],8:['Colore'],9:['Colore'],10:['Colore'],11:['Colore'],13:['Taglio','Colore'],14:['Colore'],16:['Colore','Reel'],17:['Colore','Reel'],18:['Colore'],19:['Trattamenti','Reel'],20:['Styling','Reel'],21:['Taglio','Colore','Reel'],22:['Trattamenti','Reel'],23:['Colore'],25:['Colore'],26:['Trattamenti'],28:['Trattamenti'],29:['Trattamenti','Reel'],30:['Colore','Styling'],31:['Colore'],33:['Colore'],34:['Styling'],35:['Colore','Styling'],36:['Colore'],37:['Colore'],38:['Colore'],39:['Taglio','Colore'],41:['Colore']};
  c.gallery=baseGallery.map((g,i)=>({...g,category:g.manualCategory?[g.manualCategory]:(categories[i+1]||['Colore'])})).filter((g,i)=>!remove.has(i+1));
}
if(c){
text('#intro',c.intro);text('.rating-value',c.rating);text('.rating-caption',`su Google · ${c.reviewCount} recensioni`);
if(c.tagline!=='La bellezza di sentirti te.')text('#hero-title',c.tagline);
document.querySelectorAll('.google-link').forEach(a=>a.href=c.googleUrl);
document.querySelectorAll('.map-link').forEach(a=>a.href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(c.address));
document.querySelectorAll('.phone-link').forEach(a=>a.href='tel:'+c.phone.replace(/[^+\d]/g,''));
text('#contact-address',c.address);text('#hours',c.hours);
if($('#instagram')&&mediaURL(c.instagram)){$('#instagram').hidden=false;$('#instagram').href=c.instagram;}
if($('#reviews')){
$('#reviews').innerHTML=c.reviews.map(r=>`<article class="review-card"><div class="review-top"><span class="stars" aria-label="${r.stars} stelle su 5">${'★'.repeat(Math.max(1,Math.min(5,Number(r.stars)||5)))}</span><span class="google-mark" aria-label="Google">G</span></div><blockquote>“${esc(r.text)}”</blockquote><div class="review-author"><strong>${esc(r.name.charAt(0))}*******</strong><span>Google</span></div></article>`).join('');
text('#review-source',`Estratti da Google Maps · ${c.rating}/5, ${c.reviewCount} recensioni · Consultato il ${c.reviewsChecked}. Nomi mascherati. Aggiornamento manuale.`);
}
if($('#services'))$('#services').innerHTML=c.services.map((s,i)=>`<article class="service-card"><div class="service-number">0${i+1} /</div><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><ul class="service-items">${(s.items||[]).map(x=>`<li><span>${esc(x.name)}</span><strong>${esc(x.price)}</strong></li>`).join('')}</ul><a href="prenota.html?servizio=${encodeURIComponent(s.name)}">Prenota o chiedi un consiglio <svg class="ic" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a></article>`).join('');
if($('#filters')){const categories=['Tutti',...new Set(c.gallery.flatMap(g=>Array.isArray(g.category)?g.category:[g.category]))];$('#filters').innerHTML=categories.map((x,i)=>`<button type="button" aria-pressed="${i===0}" data-filter="${esc(x)}">${esc(x)}</button>`).join('');$('#filters').onclick=e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#filters button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderGallery(b.dataset.filter)};renderGallery('Tutti');}
text('#story-title',c.storyTitle);text('#story-text',c.story);
if($('#story-media')&&mediaURL(c.storyImage))$('#story-media').innerHTML=`<img src="${esc(c.storyImage)}" alt="Al bancone del salone Mikal Acconciature" loading="lazy">`;
if($('#hero-media')&&mediaURL(c.heroImage))$('#hero-media').innerHTML=`<img src="${esc(c.heroImage)}" alt="L’interno del salone Mikal Acconciature a Somma Lombardo" fetchpriority="high">`;
if($('#hero-media')&&mediaURL(c.heroVideo)){$('#hero-media').innerHTML=`<video muted loop playsinline preload="metadata" ${matchMedia('(prefers-reduced-motion: reduce)').matches?'':'autoplay'} ${mediaURL(c.heroImage)?`poster="${esc(c.heroImage)}"`:''} aria-label="Un momento da Mikal"><source src="${esc(c.heroVideo)}"></video><button class="video-toggle">Riproduci video</button>`;const v=$('#hero-media video'),b=$('.video-toggle');v.onplay=()=>b.textContent='Pausa video';v.onpause=()=>b.textContent='Riproduci video';b.onclick=()=>v.paused?v.play().catch(()=>{}):v.pause();}
if($('#offers')){const active=c.offers.filter(o=>!o.expires||o.expires>=new Date().toLocaleDateString('sv-SE'));$('#offers').innerHTML=active.length?`<div class="offer-grid">${active.map(o=>`<article class="offer-card"><p class="eyebrow">SPECIALE MIKAL</p><h3>${esc(o.title)}</h3><p class="offer-includes"><strong>${esc(o.includes||"")}</strong></p><p>${esc(o.description)}</p><p class="offer-price">${esc(o.price)}</p>${o.originalPrice?`<p class="offer-original">anziché <s>${esc(o.originalPrice)}</s></p>`:""}${o.conditions?`<p class="offer-conditions">${esc(o.conditions)}</p>`:""}${o.expires?`<p>Valida fino al ${esc(o.expires.split('-').reverse().join('/'))}</p>`:''}<a class="text-link" href="prenota.html">Scopri in salone <svg class="ic" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a></article>`).join('')}</div>`:`<div class="offer-empty"><div><h3>Le belle occasioni arrivano qui.</h3><p>Al momento non ci sono promozioni pubblicate. Torna a trovarci per le prossime novità.</p></div><a class="text-link" href="contatti.html">Restiamo in contatto <svg class="ic" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a></div>`;}
text('#copyright',`© ${new Date().getFullYear()} ${c.name}`);text('#vat',c.vat?`P. IVA ${c.vat}`:'');
const schema=document.createElement('script');schema.type='application/ld+json';schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'HairSalon',name:c.name,telephone:[c.phone,c.mobile],address:{'@type':'PostalAddress',streetAddress:'Via Milano 96',addressLocality:'Somma Lombardo',postalCode:'21019',addressRegion:'VA',addressCountry:'IT'}});document.head.append(schema);
}
function renderGallery(filter){const items=c.gallery.map((g,i)=>({...g,index:i})).filter(g=>filter==='Tutti'||(Array.isArray(g.category)?g.category.includes(filter):g.category===filter));$('#gallery').innerHTML=items.map(g=>`<article class="gallery-card"><div class="gallery-media">${mediaURL(g.src)?`<button data-media="${g.index}" aria-label="Apri immagine"><img src="${esc(g.src)}" alt="${esc(g.description||g.title)}" loading="lazy">${g.reel?'<span class="play-badge"><svg class="ic" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg> Apri il reel</span>':''}</button>`:`<div class="gallery-placeholder"><span class="symbol">∿</span><small>LA TUA FOTO QUI</small></div>`}</div></article>`).join('');if($('#gallery-note'))$('#gallery-note').hidden=c.gallery.every(g=>mediaURL(g.src));}
if($('#gallery'))$('#gallery').onclick=e=>{const b=e.target.closest('[data-media]');if(!b)return;const g=c.gallery[Number(b.dataset.media)];const post=g.postUrl&&mediaURL(g.postUrl)?`<a class="text-link gallery-post-link" href="${esc(g.postUrl)}" target="_blank" rel="noopener">Apri il post su Instagram <svg class="ic" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg></a>`:'';$('#dialog-content').innerHTML=`<img src="${esc(g.src)}" alt="${esc(g.description||g.title)}">${post}`;$('#media-dialog').showModal();};
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').onclick=()=>d.close();d.onclick=e=>{if(e.target===d)d.close()};d.onclose=()=>d.querySelectorAll('video').forEach(v=>v.pause());});
$('.menu-toggle').onclick=()=>{const open=$('#nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open))};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}});

if ($('#booking-frame')) {
  let u; try {u=new URL(c.bookingAppUrl);} catch {}
  if(u && u.protocol==='https:' && u.hostname==='script.google.com' && /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(u.pathname)) {
    $('#booking-frame').src=u.href;
  }
}
