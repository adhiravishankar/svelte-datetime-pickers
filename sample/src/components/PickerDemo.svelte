<script lang="ts">
  import DateTimeRangePicker from 'svelte-datetimerange-picker';

  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];

  const now = new Date();
  const yesterdayBegin = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const todayNoon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);

  let value = $state<Value>([yesterdayBegin, todayNoon]);
</script>

<section class="Sample__section">
  <h2>svelte-datetimerange-picker</h2>
  <DateTimeRangePicker onChange={(nextValue) => (value = nextValue)} {value} />
</section>
