<svg viewBox="0 0 100 100">
  <circle fill="#fff" cx="6" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1" />
  </circle>
  <circle fill="#fff" cx="26" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2" />
  </circle>
  <circle fill="#fff" cx="46" cy="50" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3" />
  </circle>
</svg>

<style>
  svg {
    width: 3em;
    height: 3em;
    /* Below is pretty specific to the one use-case I have right now, but that's fine for now... */
    display: block;
    margin: auto;
  }
</style>
