<script lang="ts">
  import { Heading, Icon, SkillIcon } from '$lib/components/atoms';
  import * as styles from './aboutMe.css';
  import * as spacing from '$lib/styles/spacing.css';
  import * as layout from '$lib/styles/layout.css';
  import * as constants from './constants/aboutMe';
</script>

<svelte:head>
  <title>About Me | KeveltKit</title>
</svelte:head>

<section class={layout.contentInner}>
  <div class={spacing.mbL}>
    <Heading label="About Me" />
  </div>

  <div class={`${styles.aboutProfile} ${spacing.mbXL}`}>
    <div class={styles.aboutProfileDetails}>
      {#each constants.PROFILE_LIST as item}
        <div class={styles.profileData}>
          <span class={styles.profileLabel}>{item.label}</span>
          <p class={styles.profileValue}>{item.value}</p>
        </div>
      {/each}
      <div class={styles.iconList}>
        <Icon name="envelope" iconType="fontawesome" copyText="keveltkit@gmail.com" size={45} />
        <Icon
          name="github"
          iconType="devicon"
          colored={false}
          href="https://github.com/Kei-Taros"
          size={45}
        />
      </div>
    </div>
    <div class={styles.aboutProfileImg}>
      <div class={styles.torchGlow}></div>
      <picture>
        <source srcset={'/images/about-me/profile.webp'} type="image/webp" />
        <img class={styles.profileImg} src={'/images/about-me/profile.png'} alt="profile" />
      </picture>
    </div>
  </div>
  <div class={styles.aboutText}>
    <div class={styles.warningText}>
      {#each constants.WARNING_TEXTS as text}
        <p>{text}</p>
      {/each}
    </div>
    <div class={styles.profileText}>
      {#each constants.PROFILE_TEXTS as text}
        <p>{@html text}</p>
      {/each}
    </div>
  </div>
</section>

<section class={layout.contentInner}>
  <div class={spacing.mbM}>
    <Heading label="Skills" />
  </div>

  <div class={styles.skillIconList}>
    {#each constants.SKILL_ICONS as name (name)}
      <SkillIcon {name} />
    {/each}
  </div>
</section>
