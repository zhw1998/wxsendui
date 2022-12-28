<template>
  <el-row style="height: 100%; overflow: auto">
    <!--  模板配置box  -->
    <el-col style="height: 100%; padding: 60px 30px;" :span="8">
      <el-card class="box-card model_container" style="max-height: 100%;overflow: auto;"  v-show="modelView">
        <div slot="header" class="clearfix">
          <span>模板设置</span>
        </div>
        <el-form ref="modelConfigForm" :model="configForm.modelConfig"  :rules="modelConfigFormRules" class="normal-form model-form" auto-complete="on" label-position="left">
          <el-form-item prop="modelCode">
            <el-input
              ref="modelCode"
              v-model.trim="configForm.modelConfig.modelCode"
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
              max-height="400"
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
                label="字段值">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.value"
                    placeholder="请输入字段值"
                    prop="scope.row.value"
                    :disabled="scope.row.value == '无'"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="color"
                align="center"
                label="字体颜色"
                width="100">
                <template slot-scope="scope">
                  <el-color-picker style="width: 100%" v-model="scope.row.color"></el-color-picker>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item title="请将此内容复制并且粘贴到新建的消息模板中">
            <el-input
              type="textarea"
              tabindex="1"
              placeholder="模板内容"
              v-model="configForm.modelConfig.templateContent"
              :autosize="{ minRows: 2, maxRows: 4}">
            </el-input>
          </el-form-item>
          <div class="demo-image__preview" v-if="configForm.modelConfig.imgSrc && configForm.modelConfig.imgSrc != ''">
            <el-image
              style="width: 100px; height: 100px"
              :src="configForm.modelConfig.imgSrc"
              :preview-src-list="[configForm.modelConfig.imgSrc]">
            </el-image>
          </div>
        </el-form>
      </el-card>
    </el-col>
    <!--  基础配置box  -->
    <el-col style="height: 100%; padding: 60px 30px;" :span="8">
      <el-card class="box-card config_container"  style="max-height: 100%;overflow: auto;">
        <div slot="header" class="clearfix">
          <span>基本配置</span>
        </div>
        <el-form ref="configForm" :model="configForm" :rules="configFormRules" class="normal-form login-form" auto-complete="on" label-position="left">
          <el-form-item prop="applyCode">
            <el-input
              ref="applyCode"
              v-model.trim="configForm.applyCode"
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
              v-model.trim="configForm.appId"
              placeholder="appId"
              name="appId"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <el-form-item prop="appSecret">
            <el-input
              ref="appSecret"
              v-model.trim="configForm.appSecret"
              placeholder="appSecret"
              name="appSecret"
              type="text"
              tabindex="1"
            />
          </el-form-item>
          <el-form-item prop="modelConfig.modelId">
            <el-select v-model="configForm.modelConfig.modelId" placeholder="请选择模板" @change="modelChange" >
              <el-option
                v-for="item in models"
                :label="item.name"
                :value="item.id"
                :disabled="false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="way">
            <el-row :gutter="10">
              <el-col :span="wayValues[configForm.way] != null ? 12 : 24">
                <el-select @change="configForm.wayValue=null" v-model="configForm.way" placeholder="发送策略">
                  <el-option
                    v-for="(value, name) in ways"
                    :label="name"
                    :value="value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="wayValues[configForm.way] != null ? 12 : 0">
                <el-select v-model="configForm.wayValue" placeholder="请选择">
                  <el-option
                    v-for="(value) in wayValues[configForm.way]"
                    :label="value"
                    :value="value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="sendTime">
            <el-time-select
              placeholder="发送时间"
              v-model="configForm.sendTime"
              style="width: 60%"
              :picker-options="{
                start: '00:00',
                step: '00:05',
                end: '23:50'
              }"
            >
            </el-time-select>
            <el-switch
              v-model="configForm.status"
              style="width: calc(40% - 20px); padding-left: 20px;"
              active-text="开启"
              active-color="#13ce66"
              active-value="1"
              inactive-text="关闭"
              inactive-value="0"
              inactive-color="#eee">
            </el-switch>
          </el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="addConfig">{{btnText}}</el-button>
        </el-form>
      </el-card>
    </el-col>
    <!--  用户配置box  -->
    <el-col style="height: 100%; padding: 60px 30px;" :span="8">
      <el-card class="box-card user_container" style="max-height: 100%;overflow: auto;"  v-show="userView">
        <div slot="header" class="clearfix">
          <span>接收人</span>
          <el-button style="float: right; padding: 3px 0" @click="addUser()" type="text">新增</el-button>
        </div>
        <div style="position: relative">
          <el-table
            :data="configForm.sendUsers"
            border
            max-height="700"
            style="width: 100%; border-radius: 5px;">
            <el-table-column
              fixed
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
                  v-model.trim="scope.row.userOpenId"
                  prop="scope.row.userOpenId"
                  placeholder="请输入用户openId"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              width="60">
              <template slot-scope="scope">
                <el-button @click="userDelete(scope.$index)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
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
    //发送方式校验
    var wayVaild = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择发送方式'));
      } else {
        if (this.wayValues[value] && this.configForm.wayValue == null) {
          callback(new Error('请选择具体方式'));
        }
        callback();
      }
    };
    return {

      configForm: {
        id: null,
        applyCode: '', //申请码
        appId: '',  //微信公众号appid
        appSecret: '',  //微信公众号appSecret
        modelCode: '', //微信公众号 消息模板
        way: '', //发送策略
        wayValue: '',
        sendTime: null,
        sendUsers: [], //发送用户
        status: '1',
        modelConfig: { //模板信息
          modelId: null,
          configId: null,
          modelCode: '',
          filedContent: [],
          imgSrc: '',
          templateContent:'',
        },
      },
      //主配置检验规则
      configFormRules: {
        applyCode: [{  required: true, trigger: 'blur', message: '请输入申请码' }],
        appId: [{  required: true, trigger: 'blur', message: '请输入appid' }],
        appSecret: [{  required: true, trigger: 'blur', message: '请输入appSecret' }],
        sendTime: [{  required: true, trigger: 'blur', message: '请选择发送时间' }],
        way: [{  validator: wayVaild, trigger: 'blur' }],
        "modelConfig.modelId": [{  required: true, trigger: 'blur', message: '请选择模板' }],
      },

      modelConfigFormRules: {
        modelCode : [{  required: true, trigger: 'blur', message: '请输入模版ID' }],
      },
      //发送策略
      ways : {},
      wayValues: {},
      //模板信息
      models: [],
      modelView: false,
      //用户信息模块
      userView: false,
      btnText: '添加',
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
        //数据处理 每周:['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        var ways = {};
        for(let key in res.data){
          var name = key;
          var names = key.split(':');
          if(names.length > 1){
            name = names[0];
            //可选值 默认是数组对象
            this.wayValues[res.data[key]] = eval(names[1]);
          }
          ways[name] = res.data[key];
        }
        console.log(this.wayValues)
        console.log(this.ways)
        this.ways = ways
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
    wayVaild(){

    },
    //根据申请码查询配置信息
    searchByApplyCode(){
      if(this.configForm.applyCode.trim() == ''){
        return
      }
      this.loading = true;
      searchByApplyCode(this.configForm.applyCode).then(res => {
          this.loading = false;
          if(res && res.succ){
            if(res.data){
              //数据转换json => 数组
              if(res.data.modelConfig && res.data.modelConfig.filedContent){
                res.data.modelConfig.filedContent =  eval(JSON.parse(res.data.modelConfig.filedContent));
              }
              this.configForm = res.data;
              this.configForm.status = this.configForm.status.toString();
              //模板数据
              this.models.forEach((item) => {
                if(item.id == this.configForm.modelConfig.modelId){
                  this.configForm.modelConfig.templateContent = item.templateContent;
                  this.configForm.modelConfig.imgSrc = item.imgSrc;
                }
              })
              if(this.configForm.modelConfig){
                //显示模板配置和用户配置模块
                this.modelView = true;
                this.userView = true;
              }
              this.btnText = '修改';
            }else {
              Message.info('没找到');
            }
          }else {
            Message.info(res.msg || '搜索失败');
          }
        })

    },
    //模板选择事件
    modelChange(){
      //显示模板配置和用户配置模块
      this.modelView = true;
      this.userView = true;
      this.models.forEach((item) => {
        if(item.id == this.configForm.modelConfig.modelId){
          this.configForm.modelConfig.filedContent = item.filedContent;
          this.configForm.modelConfig.templateContent = item.templateContent;
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
      this.loading = true;
      //数组json化
      //基本配置校验
      this.$refs.configForm.validate(valid => {
        this.loading = false;
        if(valid){
          //接收人不能为空
          if (this.configForm.sendUsers.length == 0){
            this.loading = false;
            Message.error("没有添加接收用户");
            return
          }
          //模板配置校验
          this.$refs.modelConfigForm.validate(modelVaild => {
            if(modelVaild){
              this.configForm.modelConfig.filedContent = JSON.stringify(this.configForm.modelConfig.filedContent);
              //保存
              save(this.configForm).then(res => {
                if(res && res.succ){
                  //保存一下id
                  Message.info(this.configForm.id == null ? "添加成功" : "修改成功");
                  // this.configForm.id = res.data;
                  //刷新页面
                  setTimeout(function (){
                    window.location.reload();
                  }, 1000);
                }else {
                  this.loading = false;
                  Message.error(res.msg);
                }
              })
            }else {
              this.loading = false;
            }
          })
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

.box-card {
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
.box-card {
  overflow: auto;
  max-height: 100%;
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
