<script>
  import { page } from '$app/stores'
  import '../app.css'
</script>

<div class="hero min-h-[100vh]">
  <div class="max-w-lg">
    <h1 class="text-5xl font-bold">This is embarassing...</h1>
    <p class="pb-3 pt-1 text-2xl">
      There was an error: {$page?.error?.message}
    </p>
    <div>
      <a href="/" class="btn btn-primary btn-wide">Return Home</a>
    </div>
  </div>
</div>
