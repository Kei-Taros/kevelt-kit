<script lang="ts">
  import { Heading, Tag, DataItem } from '$lib/components/atoms';
  import { Modal } from '$lib/components/Molecule';
  import type { WorkDetail } from './WorkModal.types';
  import * as styles from './WorkModal.css';

  interface Props {
    isOpen: boolean;
    closeModal: () => void;
    workDetail: WorkDetail;
  }

  let { isOpen, closeModal, workDetail }: Props = $props();
</script>

<Modal {isOpen} {closeModal}>
  <div class={styles.content}>
    <section class={styles.header}>
      <Heading label={workDetail.title} as="h2" class={styles.workTitle} />
    </section>

    <section class={styles.summary}>
      <img src={workDetail.src} alt={workDetail.title} class={styles.image} />
      <p class={styles.description}>{workDetail.summary}</p>

      <div class={styles.summaryGrid}>
        <DataItem label="期間" value={workDetail.period} />
        <DataItem label="担当" value={workDetail.role} />
        <DataItem label="担当範囲" value={workDetail.scope} />
      </div>

      <div class={styles.tagList}>
        {#each workDetail.categories as category}
          <Tag label={category} variant="secondary" />
        {/each}
        {#each workDetail.techStack as tech}
          <Tag label={tech} />
        {/each}
      </div>
    </section>

    <section class={styles.details}>
      <div>
        <Heading label="業務内容" as="h3" />
        <ul class={styles.detailList}>
          {#each workDetail.responsibilities as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
      <div>
        <Heading label="実績・取り組み" as="h3" />
        <ul class={styles.detailList}>
          {#each workDetail.highlights as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    </section>
  </div>
</Modal>
