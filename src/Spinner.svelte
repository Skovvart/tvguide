<svg viewBox="0 0 100 50" {...$$restProps}>
  <circle cx="25" cy="25" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1" />
  </circle>
  <circle cx="50" cy="25" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2" />
  </circle>
  <circle cx="75" cy="25" r="6">
    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3" />
  </circle>
</svg>

<style>
  svg {
    width: 3em;
    height: 2em;
    display: block;
    margin: auto;
  }
  circle {
    fill: var(--color-text);
  }
</style>
