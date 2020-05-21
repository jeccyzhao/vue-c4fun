<script>
import PipelineJobName from './pipeline-job-name.vue'
/**
 * Renders the badge for the pipeline graph and the job's dropdown.
 *
 * The following object should be provided as `job`:
 *
 * {
 *   "id": 4256,
 *   "name": "test",
 *   "status": {
 *     "icon": "status_success",
 *     "text": "passed",
 *     "label": "passed",
 *     "group": "success",
 *     "tooltip": "passed",
 *     "details_path": "/root/ci-mock/builds/4256",
 *     "action": {
 *       "icon": "retry",
 *       "title": "Retry",
 *       "path": "/root/ci-mock/builds/4256/retry",
 *       "method": "post"
 *     }
 *   }
 * }
 */
export default {
  components: {
    PipelineJobName
  },
  props: {
    job: {
      type: Object,
      required: true
    },
    mini: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    cssClassJobName: {
      type: String,
      required: false,
      default: ''
    },
    dropdownLength: {
      type: Number,
      required: false,
      default: Infinity
    }
  },
  computed: {
    boundary () {
      return this.dropdownLength === 1 ? 'viewport' : 'scrollParent'
    },
    status () {
      return this.job && this.job.status ? this.job.status : {}
    },
    tooltipText () {
      const textBuilder = []
      const { name: jobName } = this.job
      if (jobName) {
        textBuilder.push(jobName)
      }
      const { tooltip: statusTooltip } = this.status
      if (jobName && statusTooltip) {
        textBuilder.push('-')
      }
      if (statusTooltip) {
        if (this.isDelayedJob) {
          // textBuilder.push(sprintf(statusTooltip, { remainingTime: this.remainingTime }));
        } else {
          // textBuilder.push(statusTooltip);
        }
      }
      return textBuilder.join(' ')
    },
    /**
     * Verifies if the provided job has an action path
     *
     * @return {Boolean}
     */
    hasAction () {
      return this.job.status && this.job.status.action && this.job.status.action.path
    }
  },
  methods: {
    pipelineActionRequestComplete () {
      this.$emit('pipelineActionRequestComplete')
    }
  }
}
</script>
<template>
  <div class="ci-job-component">
    <span
      v-if="status.has_details"
      :href="status.details_path"
      :title="tooltipText"
      class="js-pipeline-graph-job-link qa-job-link"
      :class="{'build-content': !mini}"
    >
      <PipelineJobName :mini="mini" :size="size" :name="job.name" :status="job.status" />
    </span>
    <div
      v-else
      :title="tooltipText"
      :class="{'build-content': !mini}"
      class="js-job-component-tooltip non-details-job-component"
    >
      <PipelineJobName :mini="mini" :size="size" :name="job.name" :status="job.status" />
    </div>
  </div>
</template>
