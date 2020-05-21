<script>
/**
 * Component that renders both the CI icon status and the job name.
 * Used in
 *  - Badge component
 *  - Dropdown badge components
 */
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    mini: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    status: {
      type: String,
      required: true,
    },
  },
  computed: {
    cssClass() {
      const status = this.status;
      return `ci-status-icon ci-status-icon-${status} js-ci-status-icon-${status}`;
    }
  }
};
</script>
<template>
  <span class="ci-job-name-component">
    <span :class="cssClass">
      <svg aria-hidden="true"> 
          <use :xlink:href="'icons/ci-icons.svg#status_' + status + ''"/>
      </svg>
    </span>
    <span v-if="!mini" class="ci-status-text text-truncate mw-70p gl-pl-1 d-inline-block align-bottom">
      {{ name }}
    </span>
  </span>
</template>
