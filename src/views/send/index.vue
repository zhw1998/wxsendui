<template>
  <el-row :gutter="40">
    <!--  基础配置box  -->
    <el-col :span="7">
      <div class="container config_container">
        <el-form ref="msgDto" :model="msgDto" class="normal-form login-form" auto-complete="on" label-position="left">

          <div class="title-container">
            <h3 class="title">基础配置</h3>
          </div>

          <el-form-item prop="applyCode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
            <el-input
              ref="applyCode"
              v-model="msgDto.applyCode"
              placeholder="申请码"
              name="applyCode"
              type="text"
              tabindex="1"
              auto-complete="on"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item prop="appId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
            <el-input
              ref="appId"
              v-model="msgDto.appId"
              placeholder="appId"
              name="appId"
              type="text"
              tabindex="1"
            />
          </el-form-item>

          <el-form-item prop="appSecret">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
            <el-input
              ref="appSecret"
              v-model="msgDto.appSecret"
              placeholder="appSecret"
              name="appSecret"
              type="text"
              tabindex="1"
            />
          </el-form-item>
          <el-form-item prop="appSecret">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
            <el-input
              ref="appSecret"
              v-model="msgDto.appSecret"
              placeholder="appSecret"
              name="appSecret"
              type="text"
              tabindex="1"
            />
          </el-form-item>
          <el-form-item prop="modelConfig">
            <el-select v-model="msgDto.modelConfig.id" placeholder="请选择" @change="modelChange" >
              <el-option
                v-for="item in models"
                :label="item.name"
                :value="item.id"
                :disabled="false">
              </el-option>
            </el-select>
          </el-form-item>

          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">添加</el-button>

        </el-form>
      </div>
    </el-col>
    <!--  模板配置box  -->
    <el-col :span="8">
      <div class="container model_container"  v-show="modelView">
        <el-form ref="msgDto" :model="model" class="normal-form model-form" auto-complete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">{{model.name}}</h3>
          </div>
          <el-form-item>
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
            <el-input
              ref="applyCode"
              v-model="model.applyCode"
              placeholder="申请码"
              name="applyCode"
              type="text"
              tabindex="1"
              auto-complete="on"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item>
            <el-input
              type="textarea"
              tabindex="1"
              v-model="model.templateContent"
              :disabled="true">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <!--  用户配置box  -->
    <el-col :span="9">
      <div class="container user_container" v-show="userView">
        用户配置box
      </div>
    </el-col>
  </el-row>

</template>

<script>

export default {
  name: 'addMsg',
  data() {
    return {
      msgDto: {
        applyCode: '', //申请码
        appId: '',  //微信公众号appid
        appSecret: '',  //微信公众号appSecret
        modelCode: '', //微信公众号 消息模板
        sendUsers: [], //发送用户
        modelConfig: { //模板信息

        },
      },
      //用户信息
      sendUser: {
        userName: '', //用户名称
        userOpenId: ''  //微信公众号 openId
      },
      //模板信息
      models: [],
      modelView: false,
      model: {
        id: null,
        name: '',
        filedContent:[],
        templateContent:'',
        imgSrc: '',
      },
      //用户信息
      userView: false,


      loading: false,
      redirect: undefined
    }
  },
  mounted() {
    //查询模板信息
    this.models = [
      {id: 10, name: '模板名称22', templateContent: '模板内容(样例图)', filedContent:[{filed:'name',filedName:'用户名',value: '测试1'},{filed:'birthday',filedName:'生日',value: '1998-10-10'}], imgSrc: ''}
    ];
    //
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    //模板选择事件
    modelChange(){
      var that = this;
      that.modelView = true;
      that.models.forEach((item) => {
        if(item.id == that.msgDto.modelConfig.id){
          that.model = item;
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.msgDto.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.msgDto).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
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

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .config_container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */

.container {
  .el-input {
    display: inline-block;
    width: calc(100% - 30px);

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-select{
    width: 100%;
    .el-input {
      width: 100%;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray:#889aa4;
$light_gray:#eee;
.container {
  overflow: hidden;
  padding: 50px 35px 0;
  .normal-form {
    position: relative;
    width: 520px;
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

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
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
