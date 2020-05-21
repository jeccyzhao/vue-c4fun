<script>
import PipelineJobItem from './pipeline-job-item.vue'
export default {
  components: {
    PipelineJobItem
  },
  props: {
    title: {
      type: String,
      required: true
    },
    groups: {
      type: Array,
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
    isFirstColumn: {
      type: Boolean,
      required: false,
      default: false
    },
    stageConnectorClass: {
      type: String,
      required: false,
      default: ''
    },
    action: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  computed: {
    hasAction () {
      return this.action //! _.isEmpty(this.action);
    }
  },
  methods: {
    buildConnnectorClass (index) {
      return index === 0 && !this.isFirstColumn ? 'left-connector' : ''
    },
    groupId (group) {
      return `ci-badge-${group.name}` // ${_.escape(group.name)}`;
    },
    pipelineActionRequestComplete () {
      this.$emit('refreshPipelineGraph')
    }
  }
}
</script>
<template>
  <li :class="stageConnectorClass" class="stage-column">
    <div class="stage-name position-relative" v-if="!mini">
      {{ title }}
    </div>

    <div class="builds-container">
      <ul>
        <li
          v-for="(group, index) in groups"
          :id="groupId(group)"
          :key="group.name"
          :class="buildConnnectorClass(index)"
          class="build"
        >
          <div class="curve"></div>

          <PipelineJobItem
            :job="group.jobs[0]"
            :mini="mini"
            :size="size"
            css-class-job-name="build-content"
          />
        </li>
      </ul>
    </div>
  </li>
</template>
