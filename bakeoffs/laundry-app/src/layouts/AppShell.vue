<template>
  <div class="site-shell">
    <header class="site-header container">
      <RouterLink class="brand" to="/"><span class="brand-mark">W</span><span>Washboard</span></RouterLink>
      <nav class="site-nav" aria-label="Primary navigation"><RouterLink to="/">Live status</RouterLink><RouterLink to="/dashboard">My dashboard</RouterLink><RouterLink class="button button--small button--dark" to="/login">Sign in</RouterLink></nav>
    </header>
    <main><RouterView /></main>
    <footer class="site-footer container"><span>Washboard</span><span>Simple scheduling for shared laundry rooms.</span></footer>
  </div>
</template>
