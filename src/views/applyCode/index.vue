<template>
  <el-row  style="height: 100%;">
    <el-col :span="16" :offset="4" style="height: 100%; padding: 50px 0;">
      <el-card class="box-card"  style="max-height: 100%;overflow: auto;position: relative;">
        <div slot="header" class="clearfix">
          <span style="font-size: 20px;">申请码</span>
          <el-button style="float: right; padding: 3px 0" @click="create()" type="text">创建</el-button>
        </div>
        <el-table
          :data="applyCodeList"
          max-height="850"
          style="width: 100%; border-radius: 5px;">
          <el-table-column
            fixed
            prop="code"
            label="申请码"
            align="center"
            width="360">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            sortable
            width="240">
          </el-table-column>
          <el-table-column
            prop="ip"
            label="ip"
            align="center"
            empty-text="无"
            width="240">
          </el-table-column>
          <el-table-column
            prop="usedTime"
            sortable
            label="使用时间"
            align="center"
            empty-text="无"
            width="240">
          </el-table-column>
          <el-table-column
            prop="tag"
            label="标签"
            align="center"
            width="120"
            :filters="[{ text: '使用', value: '1' }, { text: '未使用', value: '0' }]"
            :filter-method="filterStatus"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status == 0 ? 'info' : 'success'"
                disable-transitions>{{scope.row.status == 0 ? "未使用" : "使用"}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

  </el-row>
</template>



<script>

import {list, create} from '@/api/applyCode'

export default {
  name: 'model',
  data() {
    return {
      applyCodeList:[]
    }
  },
  mounted() {
    this.loadTable();
  },
  watch: {

  },
  methods: {
    loadTable(){
      //加载所有的申请码
      list().then(res => {
        if(res && res.succ){
          this.applyCodeList = JSON.parse(res.data);
        }
      })
    },
    filterStatus(value, row) {
      console.log(value)
      return row.status == value;
    },
    //创建申请码
    create(){
      this.$prompt('请输入创建数量', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^([0-9][0-9]{0,1}|100)$/,
        inputErrorMessage: '请输入数字0-100'
      }).then(({ value }) => {
        create(value).then(res => {
          if(res && res.succ){
            //表格刷新
            this.loadTable();
          }
        })
      }).catch(() => {

      });
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {

}

</style>

<style lang="scss" scoped>

</style>

<style scoped>
/* 修改验证器样式 */
::v-deep .el-form-item.is-error .el-input__inner {
  border-color: #889aa4;
}
::v-deep .el-form-item.is-error .el-input__validateIcon {
  color: #889aa4;
}
::v-deep .el-form-item__error {
  color: #e6a23c;
}
</style>
