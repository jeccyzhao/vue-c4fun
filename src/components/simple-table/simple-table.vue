<template>
  <div v-if="visible" class="table-wrapper">
    <div v-if="searchFormFields && searchFormFields.fields && searchFormFields.fields.length" class="box table-search">
      <form :action="searchFormFields.action">
        <div class="visible-form">
          <span v-for="field in visibleSearchFormFields" :key="field.name" class="search-field">
            <label>{{ field.label }}:</label>
            <Input v-if="field.type === 'input'" v-model="formFields[field.name]" :name="field.name" :placeholder="field.placeholder" size="small" :style="{ width: field.width }" />
            <Select
              v-if="field.type === 'select'"
              v-model="formFields[field.name]"
              :placeholder="field.placeholder"
              :name="field.name"
              clearable
              filterable
              size="small"
              :style="{ width: field.width }"
              @on-change="onSelectChange(field.name, field.onChange)"
            >
              <Option v-for="option in field.options" :key="option.value" :value="option.value" :label="option.label" />
            </Select>
            <Cascader v-if="field.type === 'cascader'" v-model="formFields[field.name]" :data="field.options" filterable trigger="hover" :style="{ width: field.width }" @on-change="handleCascaderChange" />
            <DatePicker
              v-if="field.type === 'dateranger'"
              type="daterange"
              :options="field.options"
              :placeholder="field.placeholder"
              size="small"
              :style="{ width: field.width }"
              @on-change="handleDateRangeChange"
            />
          </span>
          <Button type="primary" :loading="showLoading" icon="ios-search" size="small" style="margin-left: 8px" @click="handleSearch">
            搜索
          </Button>
          <span v-if="hiddenSearchFormFields.length > 0" style="float: right; color: #2d8cf0; cursor: pointer" @click="toggleHiddenFormFields">
            <Icon :type="showHiddenFormFields ? 'ios-arrow-up' : 'ios-arrow-down'" />更多筛选条件
          </span>
        </div>
        <div class="hidden-form" :style="{display: showHiddenFormFields ? 'block' : 'none'}">
          <span v-for="field in hiddenSearchFormFields" :key="field.name" class="search-field">
            <label>{{ field.label }}:</label>
            <Input v-if="field.type === 'input'" v-model="formFields[field.name]" :name="field.name" :placeholder="field.placeholder" size="small" :style="{ width: field.width }" />
            <Select
              v-if="field.type === 'select'"
              v-model="formFields[field.name]"
              :placeholder="field.placeholder"
              :name="field.name"
              clearable
              filterable
              size="small"
              :style="{ width: field.width }"
              @on-change="onSelectChange(field.name, field.onChange)"
            >
              <Option v-for="option in field.options" :key="option.value" :value="option.value" :label="option.label" />
            </Select>
            <Cascader v-if="field.type === 'cascader'" v-model="formFields[field.name]" :data="field.options" filterable trigger="hover" :style="{ width: field.width }" @on-change="handleCascaderChange" />
            <DatePicker
              v-if="field.type === 'dateranger'"
              type="daterange"
              :options="field.options"
              :placeholder="field.placeholder"
              size="small"
              :style="{ width: field.width }"
              @on-change="handleDateRangeChange"
            />
          </span>
        </div>
      </form>
    </div>
    <div :class="classes">
      <div class="table-toolbox">
        <Row type="flex" justify="space-between">
          <i-col span="16">
            <div v-if="pager" class="align-left">
              每页
              <Select v-model="pageSize" size="small" :disabled="showLoading" style="width:60px; margin: 0 5px;" @on-change="handlePageSizeChange">
                <Option v-for="item in pageSizeList" :key="item" :value="item">
                  {{ item }}
                </Option>
              </Select>条记录
            </div>
          </i-col>
          <i-col span="8">
            <div class="align-right button-kits">
              <Button
                v-if="showDel"
                :loading="showLoading"
                size="small"
                icon="ios-trash-outline"
                type="error"
                @click="handleBatchDelete"
              >
                {{ deleteText }}
              </Button>
              <Button
                v-if="showAdd"
                :loading="showLoading"
                size="small"
                icon="md-add"
                type="primary"
                @click="handleAdd"
              >
                {{ addText }}
              </Button>
              <Button
                v-if="showColumnVisible"
                :loading="showLoading"
                size="small"
                icon="md-apps"
                type="primary"
                @click="handleShowColumns"
              >
                {{ filterText }}
              </Button>
            </div>
          </i-col>
        </Row>
      </div>
      <div class="table-body">
        <Table
          :height="tableHeight"
          :loading="showLoading"
          :columns="dataColumns"
          :data="data"
          :border="border"
          :highlight-row="highlightRow"
          :stripe="stripe"
          :size="size"
          :show-summary="showSummary"
          :summary-method="handleSummary"
          :row-class-name="showRow"
          @on-select="handleSelectOne"
          @on-select-cancel="handleSelectOneCancel"
          @on-select-all="handleSelectAll"
          @on-select-all-cancel="handleSelectAllCancel"
        >
          <template slot="status" slot-scope="{ row }">
            <strong>{{ row.name }}</strong>
          </template>
        </Table>
      </div>
      <div v-if="pager" class="table-pages pages">
        <Row type="flex" justify="space-between">
          <i-col span="16">
            <div class="align-left">
              显示 {{ 1 + (pageNumber - 1) * pageSize }} 到 {{ pageNumber * pageSize }} 项，共 {{ total }} 项
            </div>
          </i-col>
          <i-col span="8">
            <Page size="small" :total="total" :page-size="pageSize" :current="pageNumber" @on-change="handePageNavigate" />
          </i-col>
        </Row>
      </div>
    </div>
    <TableColumnCheckBox
      :name="name"
      :width="300"
      :columns="enabledColumns"
      :visible="columnModalShow"
      :active-columns="dataColumns"
      @on-close="onModalClose"
      @onTableColumnChange="filterTableColumn"
    />
  </div>
</template>

<script>
import config from '@/config'
import request from '@/utils/request'
import TableColumnCheckBox from './simple-table-column'
import Vue from 'vue'
const { defaultPageSize, pageSizeList } = config

export default {
  name: 'TableWrapper',
  components: { TableColumnCheckBox },
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: true
    },
    modCount: {
      type: Number,
      default: 0
    },
    // shape: {
    //   type: String,
    //   default: '' // circle'
    // },
    showColumnVisible: {
      type: Boolean,
      default: false
    },
    searchFormFields: {
      type: Object,
      default () { return {} }
    },
    offsetHeight: {
      type: Number,
      default: 0
    },
    treeTable: {
      type: Boolean,
      default: false
    },
    treeExpand: {
      type: Boolean,
      default: true
    },
    pager: {
      type: Boolean,
      default: true
    },
    handleSummary: {
      type: Function,
      default: function () {
      }
    },
    query: {
      type: Object,
      default () { return {} }
    },
    addText: {
      type: String,
      default: '添加'
    },
    deleteText: {
      type: String,
      default: '删除'
    },
    rawData: {
      type: Array,
      default () { return [] }
    },
    filterText: {
      type: String,
      default: '筛选'
    },
    columns: {
      type: Array,
      default () { return [] }
    },
    columnsFilter: {
      type: Array,
      default () { return [] }
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    showDel: {
      type: Boolean,
      default: false
    },
    deleteLabel: {
      type: String,
      default: 'name'
    },
    initPageSize: {
      type: Number,
      default: defaultPageSize
    },
    size: {
      type: String,
      default () { return 'small' }
    }
  },
  data () {
    const fields = {}
    for (var index in this.searchFormFields.fields) {
      const field = this.searchFormFields.fields[index]
      fields[field.name] = undefined
    }
    return {
      showHiddenFormFields: false,
      showLoading: true,
      pageNumber: 1,
      total: 0,
      pageSize: this.initPageSize,
      tableHeight: document.documentElement.clientHeight - this.offsetHeight,
      data: [],
      selection: [],
      formFields: fields,
      columnModalShow: false,
      shownColumns: [],
      dataColumns: this.columns.filter(column => column.show === undefined || column.show)
    }
  },
  computed: {
    enabledColumns () {
      return this.columns.filter(column => column.show === undefined || column.show)
    },
    visibleSearchFormFields () {
      const { fields } = this.searchFormFields
      if (fields && fields.length > 0) {
        return fields.filter(field => field.hidden === undefined || field.hidden === false)
      }
      return []
    },
    hiddenSearchFormFields () {
      const { fields } = this.searchFormFields
      if (fields && fields.length > 0) {
        return fields.filter(field => field.hidden === true)
      }
      return []
    },
    pageSizeList: {
      get () { return pageSizeList },
      set (value) {}
    },
    classes () {
      return {
        box: true,
        'table-content': true,
        'no-border': !this.border
      }
    }
  },
  watch: {
    modCount (val) {
      this.loadData()
    },
    columns (val) {

    },
    url (val) {
      this.loadData()
    },
    visible (val) {
      this.loadData()
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.loadData()
    // format columns
    this.columns.filter(c => c.tree).forEach(c => {
      c.render = (h, params) => {
        return this.renderCollapseCol(h, params, params.row[c.key])
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    toggleHiddenFormFields () {
      this.showHiddenFormFields = !this.showHiddenFormFields
    },
    onSelectChange (name, callback) {
      const value = this.formFields[name]
      if (typeof callback === 'function') {
        callback(value)
      }
    },
    filterTableColumn: function (columnKeys) {
      if (columnKeys) {
        const filterDataColumns = []
        for (const column of this.columns) {
          let found = false
          for (const key of columnKeys) {
            if (column.key === key) {
              found = true
              break
            }
          }
          if (found) {
            filterDataColumns.push(column)
            // column.className = (column.className || '') + ' col-show'
            // column.hidden = false
          } else {
            // column.hidden = true
            // column.className = (column.className || '') + ' col-hide'
          }
          // column.className = found ? 'col-show' : 'col-hide'
          // if (found) {
          //  column.
          // }
          // if (found) {
          //  filterDataColumns.push(column)
          // }
        }
        // this.dataColumns = filterDataColumns
        this.dataColumns = filterDataColumns
      }
    },
    onModalClose: function () {
      this.columnModalShow = false
    },
    handleShowColumns: function () {
      this.columnModalShow = true
    },
    handleSearch: function () {
      this.showLoading = true
      this.loadData(this.pageNumber)
    },
    handleSelectOne: function (selection, row) {
      this.selection = selection
    },
    handleSelectAll: function (selection) {
      this.selection = selection
    },
    handleSelectAllCancel: function (selection) {
      this.selection = selection
    },
    handleSelectOneCancel: function (selection, row) {
      this.selection = selection
    },
    handleCascaderChange (value, selectedData) {
    },
    handleDateRangeChange: function (daterange) {
      this.formFields.startDate = daterange[0]
      this.formFields.endDate = daterange[1]
    },
    onResize (event) {
      this.tableHeight = document.documentElement.clientHeight - this.offsetHeight
    },
    handlePageSizeChange: function (pageSize) {
      this.pageSizeList = pageSize
      this.loadData(this.pageNumber)
    },
    handleAdd: function () {
      this.$emit('on-add')
    },
    renderCollapseCol: function (h, params, label) {
      const tmp = []
      for (let i = 0; i < params.row.level - 1; i++) {
        tmp.push(h('span', { class: 'ms-tree-space' }))
      }
      if (params.row.children && params.row.children.length) {
        tmp.push(
          h(
            'Icon',
            {
              props: {
                // shape: 'circle',
                // size: 'small',
                type: params.row.expand ? 'md-remove' : 'md-add'
              },
              on: {
                click: (e) => {
                  this.toggleExpanded(params)
                }
              }
            }
          )
        )
        tmp.push(h('strong', { class: 'label-parent' }, label))
      } else {
        tmp.push(h('span', label))
      }
      return h('div', tmp)
    },
    showRow: function (row, index) {
      if (this.treeTable) {
        let item = row
        let show = true
        while (item.parent) {
          const matched = this.data.find(f => f.id === item.parent)
          if (matched) {
            if (!matched.expand) {
              show = false
              break
            }
            item = matched
          } else {
            break
          }
        }
        return show ? 'row-show' : 'row-hide'
      } else {
        return 'row-show'
      }
    },
    treeToArray: function (data, expand, parent = null, level = null) {
      let arrayData = []
      data.forEach((record, index) => {
        let _level = 1
        if (level) {
          _level = level + 1
        }

        Vue.set(record, 'parent', parent ? parent.id : null)
        Vue.set(record, 'level', _level)
        Vue.set(record, 'expand', expand)
        arrayData.push(record)
        if (record.children) {
          const children = this.treeToArray(record.children, expand, record, _level)
          arrayData = arrayData.concat(children)
        }
      })

      return arrayData
    },
    // 切换下级是否展开
    toggleExpanded: function (params) {
      const record = this.data[params.index]
      record.expand = !record.expand
    },
    handleBatchDelete: function () {
      const _this = this
      if (this.selection.length === 0) {
        this.$Notice.error({
          title: '出错啦',
          desc: '请至少选择一条记录进行删除操作！'
        })
      } else {
        this.$Modal.confirm({
          title: '确定要批量删除操作么？',
          loading: true,
          render: (h, params) => {
            const items = []
            for (const selection of _this.selection) {
              let name = ''
              for (const key in selection) {
                if (key === _this.deleteLabel) {
                  name = selection[key]
                  break
                }
              }
              items.push(h('li', { }, name))
            }
            return h('ul', { style: { padding: '10px 25px 0', fontSize: '9pt' } }, items)
          },
          onOk: function () {
            const _that = this
            const ids = []
            for (const selection of _this.selection) {
              ids.push(selection.id)
            }
            request({
              url: _this.url + '/batch',
              data: { method: 'delete', data: ids },
              method: 'POST'
            }).then(res => {
              this.$Notice.success({
                title: '数据删除成功',
                desc: '数据批量删除成功!'
              })
              this.$Modal.remove()
              _this.$emit('on-batch-del', _this.selection)
            }).catch(error => {
              _that.buttonLoading = false
              console.log(error)
            })
          }
        })
      }
    },
    reload () {
      this.loadData()
    },
    handePageNavigate: function (pageNum) {
      this.loadData(pageNum)
    },
    getParams (pageNum = 1) {
      const params = {}
      params.pageNumber = pageNum > 0 ? pageNum : 0
      params.pageSize = this.pageSize
      const fields = this.formFields
      const searchFields = this.searchFormFields.fields
      for (var name in fields) {
        if (!params.hasOwnProperty(name)) {
          if (fields[name] || fields[name] === 0) params[name] = fields[name]
          for (var index in searchFields) {
            const field = searchFields[index]
            if (field.name === name && field.converter) {
              if (field.converter === 'arrayToStr' && Array.isArray(fields[name]) && fields[name].length) {
                params[name] = fields[name].join(',')
                break
              }
            }
          }
        }
      }
      Object.keys(this.query).forEach(k => {
        params[k] = this.query[k]
      })
      return params
    },
    loadData: function (pageNum = 1) {
      if (this.visible) {
        const params = this.getParams(pageNum)
        const _that = this

        const cachedColumns = this.$store.state.app.columnFilters
        if (this.name && cachedColumns[this.name]) {
          this.filterTableColumn(cachedColumns[this.name])
        } else {
          const shownColumns = []
          for (const column of this.columns) {
            if (!column.hidden && (column.show === undefined || column.show)) {
              // column.className = (column.className || '') + ' col-show'
              shownColumns.push(column)
            } else {
              // column.className = (column.className || '') + ' col-hide'
            }
          }
          this.dataColumns = shownColumns
        }

        if (this.url) {
          this.showLoading = true
          window.scrollTo(0, 0)
          request({
            url: this.url,
            method: 'get',
            params: params
          }).then(res => {
            this.showLoading = false
            this.data = _that.pager ? res.data.content : res.data
            this.total = res.data.totalElements
            this.$emit('on-ready', this.data, params)
          }).catch(error => {
            this.showLoading = false
            this.$Notice.error({ title: '数据加载失败: ' + error })
          })
        } else {
          if (this.rawData) {
            this.data = this.rawData
          }
          this.showLoading = false
        }

        // if (this.action) {
        //   const func = getApiFunction(this.action)
        //   if (func) {
        //     this.showLoading = true
        //     window.scrollTo(0, 0)
        //     func(params).then(res => {
        //       this.showLoading = false
        //       this.data = _that.pager ? res.data.data.content : res.data.data
        //       if (this.treeTable) {
        //         this.data = _that.treeToArray(this.data, this.treeExpand)
        //       }
        //       this.total = res.data.data.totalElements
        //       this.$emit('on-ready', this.data, params)
        //     }).catch(error => {
        //       this.showLoading = false
        //       console.log(error)
        //     })
        //   }
        // } else {
        //   this.showLoading = false
        // }
      }
    }
  }
}
</script>

<style lang="less" >
.ivu-checkbox-input {
  position: relative !important;
}
.button-kits {
  button {
    margin-left: 8px;
  }
}
.row-hide {
    display: none;
}
.row-show {
    opacity: 1;
}
.hidden-form {
  margin-top: 5px;
}
.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 20px;
    height: 14px;
}
.label-parent {
  margin-left: 4px;
}
.ms-tree-space::before {
    content: "";
}
</style>
