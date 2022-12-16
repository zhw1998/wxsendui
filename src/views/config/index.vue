<template>
  <el-row>
    <!--  基础配置box  -->
    <el-col :span="8">
      <div class="container config_container">
        <el-form ref="configForm" :model="configForm" :rules="configFormRules" class="normal-form login-form" auto-complete="on" label-position="left">

          <div class="title-container">
            <h3 class="title">基础配置</h3>
          </div>

          <el-form-item prop="applyCode">
            <el-input
              ref="applyCode"
              v-model="configForm.applyCode"
              placeholder="申请码"
              name="applyCode"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <i slot="suffix" class="el-icon-search" @click="searchByApplyCode"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="appId">
            <el-input
              ref="appId"
              v-model="configForm.appId"
              placeholder="appId"
              name="appId"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <el-form-item prop="appSecret">
            <el-input
              ref="appSecret"
              v-model="configForm.appSecret"
              placeholder="appSecret"
              name="appSecret"
              type="text"
              tabindex="1"
            />
          </el-form-item>
          <el-form-item prop="modelConfig">
            <el-select v-model="configForm.modelConfig.modelId" placeholder="请选择模板" @change="modelChange" >
              <el-option
                v-for="item in models"
                :label="item.name"
                :value="item.id"
                :disabled="false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="configForm.modelConfig.way" placeholder="发送策略">
              <el-option
                v-for="(value, name) in ways"
                :label="name"
                :value="value"
                :disabled="false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-time-select
              placeholder="发送时间"
              v-model="configForm.sendTime"
              style="width: 60%"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:50'
              }"
            >
            </el-time-select>
            <el-switch
              v-model="configForm.status"
              style="width: calc(40% - 40px); padding-left: 40px;"
              active-text="开启"
              active-color="#13ce66"
              active-value="1"
              inactive-text="关闭"
              inactive-value="0"
              inactive-color="#eee">
            </el-switch>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="addConfig">添加</el-button>
        </el-form>
      </div>
    </el-col>
    <!--  模板配置box  -->
    <el-col :span="8">
      <div class="container model_container"  v-show="modelView">
        <el-form ref="modelConfigForm" :model="configForm.modelConfig" :rules="modelConfigRules" class="normal-form model-form" auto-complete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">模板配置</h3>
          </div>
          <el-form-item>
            <el-input
              ref="modelCode"
              v-model="configForm.modelConfig.modelCode"
              placeholder="公众号模板id"
              name="modelCode"
              type="text"
            />
          </el-form-item>
          <el-form-item v-if="configForm.modelConfig.filedContent != '' || configForm.modelConfig.filedContent.length > 0">
            <el-table
              :data="configForm.modelConfig.filedContent"
              border
              :header-cell-style="{padding:0}"
              style="width: 100%; border-radius: 5px;">
              <el-table-column
                align="center"
                prop="name"
                label="字段名"
                width="150">
              </el-table-column>
              <el-table-column
                prop="value"
                align="center"
                label="value">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.value"
                    placeholder="请输入字段值"
                    prop="scope.row.value"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-input
              type="textarea"
              tabindex="1"
              placeholder="模板内容"
              title="复制粘贴到您新建的消息模板中"
              v-model="configForm.modelConfig.templateContent"
              :disabled="true">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <!--  用户配置box  -->
    <el-col :span="8">
      <div class="container user_container"  v-show="userView">
        <div class="title-container">
          <h3 class="title">发送人</h3>
        </div>
        <div style="position: relative">
          <el-button type="primary" icon="el-icon-plus" @click="addUser()" style="position:absolute;right: 0;z-index: 99;border-radius: 0 0 0 50%;" circle></el-button>
          <el-table
            :data="configForm.sendUsers"
            border
            style="width: 100%; border-radius: 5px;">
            <el-table-column
              align="center"
              prop="userName"
              label="用户名"
              width="100">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.userName"
                  prop="scope.row.userName"
                  placeholder="用户名"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="userOpenId"
              label="openId"
              align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.userOpenId"
                  prop="scope.row.userOpenId"
                  placeholder="请输入用户openId"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="80">
              <template slot-scope="scope">
                <el-button @click="userDelete(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<script>
import {list} from '@/api/model'
import {Message} from 'element-ui'
import {searchByApplyCode, save, getWay} from '@/api/config'

export default {
  name: 'addMsg',
  data() {
    return {
      configForm: {
        applyCode: '', //申请码
        appId: '',  //微信公众号appid
        appSecret: '',  //微信公众号appSecret
        modelCode: '', //微信公众号 消息模板
        way: '', //发送策略
        sendTime: null,
        sendUsers: [], //发送用户
        status: 0,
        modelConfig: { //模板信息
          modelId: null,
          configId: null,
          modelCode: '',
          filedContent: [],
        },
      },
      //主配置检验规则
      configFormRules: {
        applyCode: [{  required: true, trigger: 'blur', message: '请输入申请码' }],
        appId: [{  required: true, trigger: 'blur', message: '请输入appid' }],
        appSecret: [{  required: true, trigger: 'blur', message: '请输入appSecret' }],
        way: [{  required: true, trigger: 'blur', message: '请选择发送策略' }],
        sendTime: [{  required: true, trigger: 'blur', message: '请选择发送时间' }],
        modelId: [{  required: true, trigger: 'blur', message: '请选择消息模板' }],
      },
      modelConfigRules:{
        modelCode:  [{  required: true, trigger: 'blur', message: '请输入模板id' }],
      },
      //发送策略
      ways : [],
      //模板信息
      models: [],
      modelView: false,
      //用户信息模块
      userView: false,

      loading: false,
      redirect: undefined
    }
  },
  mounted() {
    //查询模板信息
    list().then(res => {
      if(res && res.succ && res.data){
        this.models = res.data
        for(var i = 0; i < this.models.length; i++){
          if(this.models[i].filedContent && this.models[i].filedContent != ''){
            this.models[i].filedContent = JSON.parse(this.models[i].filedContent);
          }
        }
      }
    }),
    //发送策略
    getWay().then(res => {
      if(res && res.succ && res.data){
        this.ways = res.data
      }
    })
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
  },
  methods: {
    //根据申请码查询配置信息
    searchByApplyCode(){
      Message.error("搜索");
      if(this.configForm.applyCode.trim() != ''){
        searchByApplyCode(this.configForm.applyCode).then(res => {
          console.log(res);
          if(res && res.succ && res.data){

          }else {
            Message.info(res.msg || '搜索失败');
          }
        })
      }
    },
    //模板选择事件
    modelChange(){
      var that = this;
      //显示模板配置和用户配置模块
      that.modelView = true;
      that.userView = true;
      that.models.forEach((item) => {
        if(item.id == that.configForm.modelConfig.modelId){
          that.configForm.modelConfig.filedContent = item.filedContent;
        }
      })
    },
    //添加发送用户
    addUser(){
      if(this.configForm.sendUsers.length >= 10){
        Message.error("最多发送10个用户");
        return;
      }
      this.configForm.sendUsers.push({userName: '', userOpenId: ''})
    },
    //用户删除
    userDelete(index) {
      this.$delete(this.configForm.sendUsers, index)
    },
    //提交配置
    addConfig() {
      //数组json化
      this.configForm.modelConfig.filedContent = JSON.stringify(this.configForm.modelConfig.filedContent);
      this.$refs.configForm.validate(valid => {
        if(valid){
          if(this.configForm.modelConfig.modelCode == null || this.configForm.modelConfig.modelCode.length == 0){
            Message.error("请输入消息模板id");
            this.$refs.modelCode.focus();
            return false;
          }
          save(this.configForm).then(res => {
            if(res && res.succ){
              this.searchByApplyCode();
            }else {
              Message.error(res.msg);
            }
          })
        }else {
          Message.error("保存失败:基础配置中有数据未填写");
          return false
        }
      })

    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {

}

/* reset element-ui css */

.container {
  .el-select, .el-date-editor{
    width: 100%;
    .el-input {
      width: 100%;
    }
  }
}
</style>

<style lang="scss" scoped>
$light_gray:#eee;
.container {
  overflow: hidden;
  padding-top: 50px;
  padding: 100px 50px;
  .normal-form {
    position: relative;
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
