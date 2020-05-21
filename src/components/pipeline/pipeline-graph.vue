<script>
import PipelineStageColumn from './pipeline-stage-column.vue'
export default {
  components: {
    PipelineStageColumn
  },
  props: {
    isLoading: {
      type: Boolean,
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
    pipeline: {
      type: Object,
      required: true
    }
  },
  computed: {
    graph () {
      return this.pipeline && this.pipeline.stages
    }
  },
  methods: {
    capitalizeStageName (name) {
      const escapedName = name // _.escape(name);
      return escapedName.charAt(0).toUpperCase() + escapedName.slice(1)
    },
    isFirstColumn (index) {
      return index === 0
    },
    stageConnectorClass (index, stage) {
      let className

      // If it's the first stage column and only has one job
      if (index === 0 && stage.groups.length === 1) {
        className = 'no-margin'
      } else if (index > 0) {
        // If it is not the first column
        className = 'left-margin'
      }

      return className
    },
    refreshPipelineGraph () {
      this.$emit('refreshPipelineGraph')
    }
  }
}
</script>
<template>
  <div class="build-content middle-block js-pipeline-graph">
    <div class="pipeline-visualization pipeline-graph pipeline-tab-content">
      <ul v-if="!isLoading" class="stage-column-list" :class="{'pipeline-mini': mini}">
        <PipelineStageColumn
          v-for="(stage, index) in graph"
          :mini="mini"
          :size="size"
          :key="index"
          :title="capitalizeStageName(stage.name)"
          :groups="stage.groups"
          :stage-connector-class="stageConnectorClass(index, stage)"
          :is-first-column="isFirstColumn(index)"
          @refreshPipelineGraph="refreshPipelineGraph"
        />
      </ul>
    </div>
  </div>
</template>
