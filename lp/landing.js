// Script da LP (wrapper DOMContentLoaded removido; roda via next/script afterInteractive)
// Sons de clique — apenas em CTAs e vídeos
  const soundSel='.btn, .post-cta, .faq-q, [data-video-id], .fv-card, #introVideo, .nav-links a, .mobile-menu-links a';
  const sndDown=new Audio('mouse-down.wav');
  const sndUp=new Audio('mouse-up.wav');
  sndDown.preload='auto';sndUp.preload='auto';sndDown.volume=0.55;sndUp.volume=0.55;
  const playSnd=a=>{try{a.currentTime=0;a.play().catch(()=>{})}catch(e){}};
  let sndArmed=false;
  document.addEventListener('mousedown',e=>{
    if(e.button!==0||!e.target.closest)return;
    if(e.target.closest(soundSel)){sndArmed=true;playSnd(sndDown)}
  },{passive:true});
  document.addEventListener('mouseup',()=>{
    if(sndArmed){sndArmed=false;playSnd(sndUp)}
  },{passive:true});

  // Emoji animado (Noto Lottie) alterna no badge
  const badgeEmoji=document.querySelector('.badge-emoji');
  if(badgeEmoji){
    const base='https://fonts.gstatic.com/s/e/notoemoji/latest/';
    const codes=['1f49a','1f918','1f917','1f308','1faf1_1f3fd_200d_1faf2_1f3ff','1f9be'];
    let ei=0;
    const swap=u=>{if(typeof badgeEmoji.load==='function')badgeEmoji.load(u);else badgeEmoji.setAttribute('src',u)};
    setInterval(()=>{ei=(ei+1)%codes.length;swap(base+codes[ei]+'/lottie.json')},2600);
  }

  const cursor=document.querySelector('.cursor');
  const canHover=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(cursor&&canHover&&!reduceMotion){
    document.body.classList.add('has-custom-cursor');
    let tx=0,ty=0,rafId=null;
    const update=()=>{cursor.style.transform=`translate3d(${tx}px,${ty}px,0)`;rafId=null};
    document.addEventListener('mousemove',e=>{
      tx=e.clientX;ty=e.clientY-2;
      if(!rafId)rafId=requestAnimationFrame(update);
      if(!cursor.classList.contains('is-active'))cursor.classList.add('is-active');
    },{passive:true});
    document.addEventListener('mouseleave',()=>cursor.classList.remove('is-active'));
    document.addEventListener('mouseenter',()=>cursor.classList.add('is-active'));
    document.addEventListener('mousedown',()=>cursor.classList.add('is-down'));
    document.addEventListener('mouseup',()=>cursor.classList.remove('is-down'));
    const interactiveSel='a,button,[role="button"],.faq-q,label,input,textarea,select,summary';
    const playSel='.fv-card';
    const setPlayState=el=>{
      const expanded=el.closest('.fv')&&el.closest('.fv').classList.contains('expanded');
      cursor.classList.toggle('is-pause',!!expanded);
      cursor.classList.toggle('is-play',!expanded);
      cursor.classList.remove('is-hover');
    };
    document.addEventListener('mouseover',e=>{
      if(!e.target.closest)return;
      cursor.classList.toggle('is-dark',!!e.target.closest('.foot-card'));
      const playEl=e.target.closest(playSel);
      if(playEl){setPlayState(playEl);return}
      if(e.target.closest(interactiveSel))cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout',e=>{
      const to=e.relatedTarget;
      if(!e.target.closest)return;
      const fromPlay=e.target.closest(playSel);
      const toPlay=to&&to.closest&&to.closest(playSel);
      if(fromPlay&&!toPlay){cursor.classList.remove('is-play');cursor.classList.remove('is-pause')}
      const fromInt=e.target.closest(interactiveSel);
      const toInt=to&&to.closest&&to.closest(interactiveSel);
      if(fromInt&&!toInt)cursor.classList.remove('is-hover');
    });

    const introPlayer=document.querySelector('#introVideo');
    const introPlayBtn=introPlayer&&introPlayer.querySelector('.play-btn');
    if(introPlayer&&introPlayBtn){
      let pRaf=null,ptx=0,pty=0;
      const applyP=()=>{introPlayBtn.style.transform=`translate(${ptx}px,${pty}px)`;pRaf=null};
      introPlayer.addEventListener('mouseenter',()=>{
        introPlayer.classList.add('is-following');
        cursor.classList.add('is-quiet');
      });
      introPlayer.addEventListener('mousemove',e=>{
        const r=introPlayer.getBoundingClientRect();
        ptx=e.clientX-(r.left+r.width/2);
        pty=e.clientY-(r.top+r.height/2);
        if(!pRaf)pRaf=requestAnimationFrame(applyP);
      });
      introPlayer.addEventListener('mouseleave',()=>{
        introPlayer.classList.remove('is-following');
        cursor.classList.remove('is-quiet');
        ptx=0;pty=0;
        introPlayBtn.style.transform='';
      });
    }
  }

  // Nav (toggle mobile, menu) movido para o componente React <HeaderNav>.

  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const isOpen=btn.parentElement.classList.toggle('open');
      btn.setAttribute('aria-expanded',isOpen?'true':'false');
    });
  });

  // Scroll-collapse do logo e indicador de seção movidos para <HeaderNav>.

  const brands=[
    {name:'Claude Code',slug:'claude',src:'lobe'},
    {name:'Codex',slug:'codex',src:'lobe'},
    {name:'Antigravity',slug:'antigravity',src:'lobe'},
    {name:'Figma Make',slug:'figma',src:'lobe'},
    {name:'Cursor',slug:'cursor',src:'lobe'},
    {name:'VS Code',url:'vs-code-logo.svg'},
    {name:'Supabase',slug:'supabase',src:'si'},
    {name:'Vercel',slug:'vercel',src:'si'},
    {name:'JavaScript',slug:'javascript',src:'si'},
    {name:'React',slug:'react',src:'si'},
    {name:'HTML',slug:'html5',src:'si'}
  ];
  const brandUrl=b=>b.url?b.url:(b.src==='lobe'?`https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons/${b.slug}.svg`:`https://cdn.simpleicons.org/${b.slug}/f0e7da`);
  const shuffle=arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const buildBrand=b=>{
    const el=document.createElement('span');
    el.className='brand';
    if(b.slug||b.url){
      const img=document.createElement('img');
      img.src=brandUrl(b);
      img.alt='';
      img.width=18;
      img.height=18;
      img.decoding='sync';
      el.appendChild(img);
    }else{
      const dot=document.createElement('span');
      dot.className='brand-dot';
      el.appendChild(dot);
    }
    const label=document.createElement('span');
    label.textContent=b.name;
    el.appendChild(label);
    return el;
  };
  const track=document.querySelector('#brandMarquee .marquee-track');
  if(track){
    const shuffled=shuffle(brands);
    [...shuffled,...shuffled].forEach(b=>track.appendChild(buildBrand(b)));
  }

  document.querySelectorAll('.int-logos[data-stack]').forEach(el=>{
    try{
      const items=JSON.parse(el.dataset.stack);
      items.forEach(b=>el.appendChild(buildBrand(b)));
    }catch(e){}
  });

  const colorOverride={claude:'claude-color',figma:'figma-color',codex:'codex-color'};
  const brandUrlColor=b=>b.url?b.url:(b.src==='lobe'?`https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg/icons/${colorOverride[b.slug]||b.slug}.svg`:`https://cdn.simpleicons.org/${b.slug}`);
  document.querySelectorAll('.int-card[data-top]').forEach(card=>{
    try{
      const items=JSON.parse(card.dataset.top);
      // Move o conteúdo atual para a "caixa" opaca
      const inner=document.createElement('div');
      inner.className='int-card-inner';
      while(card.firstChild)inner.appendChild(card.firstChild);
      // Camada de logos que fica ATRÁS da caixa
      const wrap=document.createElement('div');
      wrap.className='int-toplogos';
      items.forEach(b=>{
        const chip=document.createElement('span');
        chip.className='int-chip';
        if(b.white){
          chip.classList.add('is-tint');
          chip.style.setProperty('--logo',`url("${brandUrlColor(b)}")`);
        }else{
          const img=document.createElement('img');
          img.src=brandUrlColor(b);
          img.alt='';img.width=48;img.height=48;img.decoding='sync';img.loading='lazy';
          chip.appendChild(img);
        }
        wrap.appendChild(chip);
      });
      card.appendChild(wrap);   // atrás (z-index 1)
      card.appendChild(inner);  // caixa por cima (z-index 2)
    }catch(e){}
  });

  const fv=document.querySelector('#floatingVideo');
  if(fv){
    const card=fv.querySelector('.fv-card');
    const vid=fv.querySelector('video');
    const closeBtn=fv.querySelector('.fv-close');
    const backdrop=document.querySelector('.fv-backdrop');
    const cursorEl=document.querySelector('.cursor');
    const expand=()=>{
      if(fv.classList.contains('expanded'))return;
      fv.classList.add('expanded');
      if(backdrop)backdrop.classList.add('show');
      if(vid){vid.muted=false;vid.currentTime=0;vid.play().catch(()=>{})}
      if(cursorEl){cursorEl.classList.remove('is-play');cursorEl.classList.add('is-pause')}
    };
    const collapse=()=>{
      fv.classList.remove('expanded');
      if(backdrop)backdrop.classList.remove('show');
      if(vid)vid.muted=true;
      if(cursorEl){cursorEl.classList.remove('is-pause');if(card&&card.matches(':hover'))cursorEl.classList.add('is-play')}
    };
    fv.addEventListener('click',e=>{
      if(closeBtn&&closeBtn.contains(e.target)){e.stopPropagation();collapse();return}
      if(fv.classList.contains('expanded')){collapse();return}
      expand();
    });
    if(backdrop)backdrop.addEventListener('click',collapse);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&fv.classList.contains('expanded'))collapse()});
  }

  const hl=document.querySelector('.hl');
  if(hl){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          setTimeout(()=>hl.classList.add('is-on'),350);
          io.disconnect();
        }
      });
    },{threshold:0.6});
    io.observe(hl);
  }

  const videoModal=document.querySelector('#videoModal');
  if(videoModal){
    const stage=videoModal.querySelector('.video-modal-stage');
    const closeBtn=videoModal.querySelector('.video-modal-close');
    const openVideo=id=>{
      if(videoModal.classList.contains('open'))return;
      const iframe=document.createElement('iframe');
      iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      iframe.setAttribute('allow','autoplay; encrypted-media; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen','');
      stage.appendChild(iframe);
      videoModal.classList.add('open');
      document.body.style.overflow='hidden';
    };
    const closeVideo=()=>{
      videoModal.classList.remove('open');
      document.body.style.overflow='';
      const iframe=stage.querySelector('iframe');
      if(iframe)iframe.remove();
    };
    document.querySelectorAll('[data-video-id]').forEach(trigger=>{
      trigger.addEventListener('click',e=>{e.preventDefault();openVideo(trigger.dataset.videoId)});
      trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openVideo(trigger.dataset.videoId)}});
    });
    closeBtn.addEventListener('click',closeVideo);
    videoModal.addEventListener('click',e=>{if(e.target===videoModal)closeVideo()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&videoModal.classList.contains('open'))closeVideo()});
  }

  // Modal ambiente de aula (amostra gratuita) — conteúdo por módulo
  const MODULES={
    '1':{num:'01',title:'Princípios e framework',lessons:[
      {t:'O que são os Protótipos Funcionais',v:'FF70QZek-5E',free:true},
      {t:'Como a história trouxe a gente da máquina até o código'},
      {t:'Por que usar código para fazer design & não vamos abandonar o Figma'},
      {t:'Os 4 níveis de protótipos'},
      {t:'Protótipos Interativos X Protótipos Funcionais'},
      {t:'4 erros de usar IA no processo de design (que não vamos cometer)'}
    ]},
    '2':{num:'02',title:'Componentes funcionais',lessons:[
      {t:'Ferramentas Opinativas, Harness e Custos'},
      {t:'Os componentes do módulo: tabela dinâmica e player de áudio',v:'-KFh0qm6p50',free:true},
      {t:'Interface de criação do Make e preparando o design'},
      {t:'Prompt estrutural, React e array de dados'},
      {t:'Interface de edição do Make'},
      {t:'Ajustando a estrutura do protótipo no código e usando Cloudinary'},
      {t:'Busca e filtros na tabela'},
      {t:'Manipulação de dados: Estado vs. Persistência'},
      {t:'Seleção e ações em massa'},
      {t:'Edição inline e persistência com LocalStorage'},
      {t:'Fechamento da tabela e desafio de ordenação'},
      {t:'Conhecendo o v0'},
      {t:'Player de áudio: estrutura e áudio real'},
      {t:'Scrubber e controle de volume'},
      {t:'Fila, troca de faixa, shuffle e repeat'},
      {t:'Like, expandir/colapsar e estados visuais'},
      {t:'Onde as ferramentas opinativas travam (ponte pro Módulo 3)'}
    ]}
  };
  const ICON_LOCK='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>';
  const lessonModal=document.querySelector('#lessonModal');
  if(lessonModal){
    const lStage=lessonModal.querySelector('.lesson-stage');
    const lClose=lessonModal.querySelector('.lesson-close');
    const lList=lessonModal.querySelector('.lesson-list');
    const lEyebrow=lessonModal.querySelector('.lesson-eyebrow');
    const lHeadTitle=lessonModal.querySelector('.lesson-side-head h3');
    const lHeadSub=lessonModal.querySelector('.lesson-side-head p');
    const lMhead=lessonModal.querySelector('.lesson-mhead-title');
    const lBar=lessonModal.querySelector('.lesson-bar strong');
    const lPrev=lessonModal.querySelector('.lmod-prev');
    const lNext=lessonModal.querySelector('.lmod-next');
    const MODULE_KEYS=Object.keys(MODULES);
    let currentKey=null;
    const playLesson=id=>{
      const old=lStage.querySelector('iframe');if(old)old.remove();
      const iframe=document.createElement('iframe');
      iframe.src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      iframe.setAttribute('allow','autoplay; encrypted-media; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen','');
      lStage.appendChild(iframe);
    };
    const selectItem=li=>{
      lList.querySelectorAll('.lesson-item').forEach(x=>x.classList.remove('is-active'));
      li.classList.add('is-active');
      if(lBar)lBar.textContent=li.querySelector('.li-title').textContent;
      playLesson(li.dataset.lesson);
    };
    const updateNav=()=>{
      const i=MODULE_KEYS.indexOf(currentKey);
      if(lPrev)lPrev.disabled=i<=0;
      if(lNext)lNext.disabled=i>=MODULE_KEYS.length-1;
    };
    const renderModule=key=>{
      const mod=MODULES[key];if(!mod)return;
      currentKey=key;
      updateNav();
      const free=mod.lessons.filter(l=>l.free).length;
      lEyebrow.textContent=`Módulo ${mod.num}`;
      lHeadTitle.textContent=mod.title;
      lHeadSub.textContent=`${free} de ${mod.lessons.length} ${free>1?'aulas gratuitas':'aula gratuita'} · amostra`;
      lMhead.textContent=`Módulo ${mod.num} · ${mod.title}`;
      lList.innerHTML='';
      mod.lessons.forEach((l,i)=>{
        const li=document.createElement('li');
        li.className='lesson-item'+(l.free?' is-free':' is-locked');
        if(l.free)li.dataset.lesson=l.v;
        const num=String(i+1).padStart(2,'0');
        li.innerHTML=`<span class="li-num">${num}</span><span class="li-title"></span>${l.free?'<span class="li-free">Gratuita</span>':`<span class="li-ico">${ICON_LOCK}</span>`}`;
        li.querySelector('.li-title').textContent=l.t;
        if(l.free)li.addEventListener('click',()=>selectItem(li));
        lList.appendChild(li);
      });
      const first=lList.querySelector('.lesson-item.is-free');
      if(first){first.classList.add('is-active');if(lBar)lBar.textContent=first.querySelector('.li-title').textContent;}
    };
    const playFirstFree=()=>{
      const first=lList.querySelector('.lesson-item.is-free');
      if(first)playLesson(first.dataset.lesson);
    };
    const goModule=dir=>{
      const i=MODULE_KEYS.indexOf(currentKey);
      const next=MODULE_KEYS[i+dir];
      if(!next)return;
      renderModule(next);
      playFirstFree();
    };
    if(lPrev)lPrev.addEventListener('click',()=>goModule(-1));
    if(lNext)lNext.addEventListener('click',()=>goModule(1));
    const openLesson=key=>{
      const mod=MODULES[key];if(!mod)return;
      renderModule(key);
      if(!lessonModal.classList.contains('open')){
        lessonModal.classList.add('open');
        document.body.style.overflow='hidden';
      }
      playFirstFree();
    };
    const closeLesson=()=>{
      lessonModal.classList.remove('open');
      document.body.style.overflow='';
      const f=lStage.querySelector('iframe');if(f)f.remove();
    };
    document.querySelectorAll('.post-cta[data-module]').forEach(t=>{
      t.addEventListener('click',e=>{e.preventDefault();openLesson(t.dataset.module)});
      t.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLesson(t.dataset.module)}});
    });
    lClose.addEventListener('click',closeLesson);
    lessonModal.addEventListener('click',e=>{if(e.target===lessonModal)closeLesson()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&lessonModal.classList.contains('open'))closeLesson()});
    const accessCta=lessonModal.querySelector('[data-lesson-cta]');
    if(accessCta)accessCta.addEventListener('click',closeLesson);
  }

  // Captura de leads → Brevo → Hotmart migrada para o componente React
  // <LeadCapture /> (src/components/landing/LeadCapture.tsx). Vive em React
  // para re-executar a cada navegação e usar delegação de clique, evitando o
  // bug de o modal "às vezes" não abrir antes do checkout.

  document.querySelectorAll('.post, .int-card').forEach(card=>{
    let raf=null,mx=0,my=0;
    const apply=()=>{card.style.setProperty('--mx',mx+'px');card.style.setProperty('--my',my+'px');raf=null};
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      mx=e.clientX-r.left;my=e.clientY-r.top;
      if(!raf)raf=requestAnimationFrame(apply);
    });
  });

  const illBlock=document.querySelector('.illustration-block');
  if(illBlock){
    const play=()=>illBlock.classList.add('play');
    const aio=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){play();aio.disconnect()}
      });
    },{threshold:0.15,rootMargin:'0px 0px -10% 0px'});
    aio.observe(illBlock);
    setTimeout(play,3500);
  }
