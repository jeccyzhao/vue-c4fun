<template>
  <Modal v-model="showModal" :scrollable="true" :mask-closable="false" :width="width" @on-cancel="closeModal">
    <p slot="header">
      <Icon type="md-apps" />
      <span class="header-label">表单筛选</span>
    </p>
    <div style="position: relative;">
      <CheckboxGroup v-model="tableColumnsChecked" @on-change="changeTableColumns">
        <ul class="ckbox">
          <li v-for="item in columns" :key="item.key">
            <Checkbox :label="item.key" :disabled="item.disabled">
              {{ item.title }}
            </Checkbox>
          </li>
        </ul>
      </CheckboxGroup>
    </div>
    <div slot="footer" />
  </Modal>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'TableColumnCheckBox',
  props: {
    name: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default () { return [] }
    },
    activeColumns: {
      type: Array,
      default () { return [] }
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      tableColumnsChecked: []
    }
  },
  computed: {
    showModal: {
      get () { return this.visible },
      set (value) { }
    },
    tableColumns: {
      get () { return this.columns },
      set (value) {}
    }
  },
  watch: {
    showModal (val) {
      const cachedColumns = this.$store.state.system.columnFilters
      if (this.name && cachedColumns[this.name]) {
        this.tableColumnsChecked = this.$store.state.system.columnFilters[this.name]
      } else {
        this.tableColumnsChecked = this.activeColumns.filter(item => !item.hidden).map(item => item.key)
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations([
      'setColumnFilters'
    ]),
    changeTableColumns: function (columnKeys) {
      if (this.name) {
        this.setColumnFilters({ tableName: this.name, columns: columnKeys })
      }
      this.$emit('onTableColumnChange', columnKeys)
    },
    closeModal: function (changed = false) {
      this.$emit('on-close', changed)
    }
  }
}
</script>

<style lang="less" scoped>
  .ckbox {
    max-height: 400px;
    overflow: auto;
    list-style: none;
    padding: 0 20px;
    li {
      margin-bottom: 10px;
    }
  }
</style>
