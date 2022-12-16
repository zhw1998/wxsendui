<template>
  <div class="model-container">
    <el-form ref="modelForm" :model="modelForm" :rules="modelRules" class="model-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">模板</h3>
      </div>
      <el-form-item prop="name">
        <el-input
          ref="name"
          v-model="modelForm.name"
          placeholder="模板名称"
          name="name"
          type="text"
          tabindex="1"
          auto-complete="on"
        >
          <i slot="suffix" class="el-icon-search" @click="seachModelByName" style="cursor: pointer;"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="templateContent">
        <el-input
          ref="templateContent"
          type="textarea"
          name="templateContent"
          placeholder="模板内容"
          tabindex="1"
          v-model="modelForm.templateContent">
        </el-input>
      </el-form-item>
      <el-form-item style="position: relative">
        <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true; filedForm = {}" style="position:absolute;right: 0;z-index: 99;border-radius: 0 0 0 50%;" circle></el-button>
        <el-table
          :data="filedList"
          border
          :header-cell-style="{padding:0}"
          style="width: 100%; border-radius: 5px;">
          <el-table-column
            align="center"
            prop="name"
            label="字段名"
            width="130">
          </el-table-column>
          <el-table-column
            prop="key"
            label="key"
            align="center"
            width="130">
          </el-table-column>
          <el-table-column
            prop="value"
            align="center"
            label="value">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="filedDelete(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-input
          ref="imgSrc"
          v-model="modelForm.imgSrc"
          placeholder="示例图url"
          name="imgSrc"
          type="text"
        />
      </el-form-item>
      <div class="demo-image__preview">
        <el-image
          style="width: 100px; height: 100px"
          :src="modelForm.imgSrc">
        </el-image>
      </div>
      <el-button :loading="loading" type="primary" @click="saveModel()" style="width:100%;margin-bottom:30px;">保存</el-button>

    </el-form>

<!--    弹窗-->
    <el-dialog
      title="字段新增"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form  ref="filedForm" :model="filedForm" :rules="filedRules">
        <el-form-item prop="name">
          <el-select v-model="filedForm.name" placeholder="参数名称">
            <el-option
              v-for="(value, name) in filedMap"
              :key="name"
              :label="name"
              :value="name">
              <span style="float: left">{{ name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ value }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="value">
          <el-input
            ref="value"
            v-model="filedForm.value"
            placeholder="值"
            name="value"
            type="text"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFiled()">确 定</el-button>
  </span>
    </el-dialog>
  </div>


</template>



<script>

import {save, searchByName, listFiled } from '@/api/model'
import {Message} from 'element-ui'

export default {
  name: 'model',
  data() {
    return {
      modelForm:{
        id: null,
        name: '',
        templateContent: '',
        filedContent: '',
        imgSrc: ''
      },
      //可选参数列表
      filedMap : {},
      //参数列表
      filedList: [],
      //字段对象
      filedForm:{
        index: 0,
        name: '',
        key: '',
        value: ''
      },
      //表单校验
      modelRules:{
        name: [{  required: true, trigger: 'blur', message: '请输入模板名称' }],
        templateContent: [{  required: true, trigger: 'blur', message: '请输入模板内容' }],
      },
      filedRules: {
        name: [{  required: true, trigger: 'blur', message: '请选择参数名称' }],
        key: [{  required: true, trigger: 'blur', message: '请选择参数key' }],
        value: [{  required: true, trigger: 'blur', message: '请输入参数值' }],
      },
      dialogVisible: false,
      loading: false,
    }
  },
  watch: {
    //监听字段列表值修改事件
    filedList : function (){
      var filedContent = JSON.stringify(this.filedList);
      this.modelForm.filedContent = filedContent;
    },
    modelForm: function (val){
      if(this.modelForm.filedContent != ''){
        this.filedList = JSON.parse(this.modelForm.filedContent);
      }
    },
  },
  mounted(){
    //获取已实现的参数列表
    listFiled().then(res => {
      if(res && res.succ){
        this.filedMap = res.data;
      }
    })
  },
  methods: {
    //字段增加
    addFiled(){
      this.$refs.filedForm.validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          //索引
          const data = {
            name: this.filedForm.name,
            key: this.filedMap[this.filedForm.name],
            value: this.filedForm.value
          }
          this.filedList.push(data);
        } else {
          return false
        }
      })
    },
    //字段删除
    filedDelete(index) {
      this.$delete(this.filedList, index)
    },
    //查询模板
    seachModelByName(){
      var that = this;
      if(that.modelForm.name == ''){
        return
      }
      searchByName(that.modelForm.name).then(res => {
        if(res && res.succ && res.data){
          that.modelForm = res.data;
        }else {
          Message.info("模板不存在");
        }
      })
    },
    //保存模板
    saveModel(){
      var that = this;
      that.loading = true
      //提示新增还是修改
      save(this.modelForm).then(res => {
        that.loading = false
        if(res && res.succ){
          Message.success(that.modelForm.id ? "保存成功" : "新增成功");
          that.modelForm.id = res.data;
        }else{
          Message.error(res.msg);
        }
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
$dark_gray:#889aa4;
$light_gray:#eee;

.model-container {

  min-height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 50px 35px 0;
  .model-form {
    position: relative;
    width: 600px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    float: right;
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }


  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .el-select, .el-date-editor{
    width: 100%;
    .el-input {
      width: 100%;
    }
  }

}
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
