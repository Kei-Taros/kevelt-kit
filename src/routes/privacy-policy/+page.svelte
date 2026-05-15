<script lang="ts">
  import { Heading } from '$lib/components/atoms';
  import * as styles from './privacyPolicy.css';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';
  import * as constants from './constants/privacyPolicy';
</script>

<svelte:head>
  <title>Privacy Policy | KeveltKit</title>
</svelte:head>

<section class={layout.contentInner}>
  <div class={spacing.mbM}>
    <Heading label="Privacy Policy" />
  </div>

  <div class={spacing.mbS}>
    <p>{constants.INTRODUCTION}</p>
  </div>

  {#each constants.PRIVACY_POLICY_LIST as item, index (item.title)}
    <div class={spacing.mbL}>
      <Heading label={item.title} number={String(index + 1)} as="h2" variant="privacyPolicy" />

      {#each item.descriptions as description}
        <p class={styles.description}>{description}</p>
      {/each}
    </div>
  {/each}

  <div class={styles.date}>
    <p>
      {constants.PRIVACY_POLICY_DATE.established.label}：
      {constants.PRIVACY_POLICY_DATE.established.value}
    </p>
    <p>
      {constants.PRIVACY_POLICY_DATE.updated.label}：
      {constants.PRIVACY_POLICY_DATE.updated.value}
    </p>
  </div>
</section>
