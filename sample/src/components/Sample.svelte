<script lang="ts">
  import DateTimeRangePicker from 'svelte-datetimerange-picker';

  import './Sample.css';

  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const now = new Date();
  const yesterdayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const todayNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);

  let value = $state<Value>([yesterdayBegin, todayNoon]);
</script>

<div class="Sample">
  <header>
    <h1>svelte-datetimerange-picker sample page</h1>
  </header>
  <div class="Sample__container">
    <main class="Sample__container__content">
      <DateTimeRangePicker onChange={(nextValue) => (value = nextValue)} {value} />
    </main>
  </div>
</div>
