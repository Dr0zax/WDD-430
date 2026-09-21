<script>
  const colors = ['#FF7043','#B7D548','#6C63FF','#33B5A4','#F5C451'];
  let hex = '#FF7043'; let hue = 12; let alpha = 100; let copied = false;
  $: values = hex.slice(1).match(/.{2}/g).map(x => parseInt(x, 16));
  $: [r,g,b] = values;
  $: contrast = ((Math.max(luminance(values), luminance([37,44,43]))+.05)/(Math.min(luminance(values), luminance([37,44,43]))+.05)).toFixed(2);
  function luminance([red,green,blue]) { const c=[red,green,blue].map(v=>{v/=255;return v<=.03928?v/12.92:((v+.055)/1.055)**2.4}); return .2126*c[0]+.7152*c[1]+.0722*c[2]; }
  function setHex(value) { if (/^#[0-9a-f]{6}$/i.test(value)) hex=value.toUpperCase(); }
  async function copy() { await navigator.clipboard?.writeText(hex); copied=true; setTimeout(()=>copied=false,1100); }
</script>

<main class="shell"><header class="topbar"><a class="brand" href="."><span class="brand-mark">◒</span><span>Color<br><strong>Lab</strong></span></a><span class="framework">SVELTE</span></header><section class="intro"><p class="eyebrow"><span></span> Color instrument 04</p><h1>Find your<br><em>exact shade.</em></h1><p>Dial in a color, tune its transparency, and take it with you.</p></section><section class="picker"><div class="preview" style={`background:rgba(${r},${g},${b},${alpha/100})`}><span>{hex}</span></div><div class="controls"><label class="control-label">Hue <output>{hue}°</output></label><input type="range" min="0" max="360" bind:value={hue}><label class="control-label">Opacity <output>{alpha}%</output></label><input type="range" min="0" max="100" bind:value={alpha}><div class="field-row"><label class="field"><span>HEX</span><input value={hex} maxlength="7" on:change={(e)=>setHex(e.currentTarget.value)}></label><button class="copy" on:click={copy}>{copied?'Copied':'Copy'} <span>↗</span></button></div></div><div class="readouts"><div><span>RGB</span><strong>{r} · {g} · {b}</strong></div><div><span>ALPHA</span><strong>{(alpha/100).toFixed(2)}</strong></div><div><span>CONTRAST</span><strong>{contrast} : 1</strong></div></div><div class="swatches"><span>QUICK COLORS</span>{#each colors as color}<button style={`--swatch:${color}`} aria-label={color} on:click={()=>setHex(color)}></button>{/each}</div></section><footer><span>MADE FOR MAKERS</span><i></i><span>04 / 04</span></footer></main>
