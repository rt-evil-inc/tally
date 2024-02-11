<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<div class="flex flex-col justify-center items-center h-screen">
	<slot />
</div>