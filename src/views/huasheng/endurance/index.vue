<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机型名称" prop="brandName">
        <el-input v-model="queryParams.brandName" placeholder="请输入机型名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="芯片名称" prop="chipName">
        <el-input v-model="queryParams.chipName" placeholder="请输入芯片名称" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>

      <el-form-item label="手机类型" prop="phoneType">
        <el-select v-model="queryParams.phoneType" placeholder="手机类型" clearable>
          <el-option
            v-for="(item, index) in phoneTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus"
          size="mini" @click="handleAdd"  v-hasPermi="['system:post:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success" plain icon="el-icon-edit" size="mini" :disabled="single"  @click="handleUpdate"
          v-hasPermi="['huasheng:endurance:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['huasheng:endurance:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="机型名称" align="center" prop="brandName" />
      <el-table-column label="芯片名称" align="center" prop="chipName" />
      <el-table-column label="王者耗电" align="center" prop="aov" />
      <el-table-column label="原神耗电" align="center" prop="gi" />
      <el-table-column label="拍照耗电" align="center" prop="camera"/>
      <el-table-column label="B站耗电" align="center" prop="bilibili"/>
      <el-table-column label="待机耗电" align="center" prop="standby"/>
      <el-table-column label="微博耗电" align="center" prop="weibo"/>
      <el-table-column label="吃鸡耗电" align="center" prop="chicken"/>
      <el-table-column label="剩余电量" align="center" prop="residue"/> 
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['huasheng:endurance:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['huasheng:endurance:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改机型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%" append-to-body>
        <el-row :gutter="15">
          <el-form ref="form" :model="form" :rules="rules" size="medium" label-width="100px">
            <el-col :span="12">
              <el-form-item label="机型名称" prop="brandName">
                <el-input v-model="form.brandName" placeholder="请输入机型名称" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="芯片名称" prop="chipName">
                <el-input v-model="form.chipName" placeholder="请输入芯片名称" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="王者耗电" prop="aov">
                <el-input v-model="form.aov" placeholder="请输入王者耗电" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="原神耗电" prop="gi">
                <el-input v-model="form.gi" placeholder="请输入原神耗电" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拍照耗电" prop="camera">
                <el-input v-model="form.camera" placeholder="请输入拍照耗电" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="B站耗电" prop="bilibili">
                <el-input v-model="form.bilibili" placeholder="请输入B站耗电" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="待机耗电" prop="standby">
                <el-input v-model="form.standby" placeholder="请输入待机耗电" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="微博耗电" prop="weibo">
                <el-input v-model="form.weibo" placeholder="请输入微博耗电" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="吃鸡耗电" prop="chicken">
                <el-input v-model="form.chicken" placeholder="请输入吃鸡耗电" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="剩余电量" prop="residue">
                <el-input v-model="form.剩余电量" placeholder="请输入剩余电量" clearable :style="{width: '100%'}">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="手机类型" prop="phoneType">
              <el-select v-model="queryParams.phoneType" placeholder="手机类型" clearable :style="{width: '100%'}">
                <el-option
                v-for="(item, index) in phoneTypeOptions"
               :key="index"
               :label="item.label"
               :value="item.value"
               />
            </el-select>
           </el-form-item>
          </el-col>
            <el-col :span="12">
              <el-form-item label="创建日期" prop="createTime">
                <el-date-picker v-model="form.createTime" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"
                  :style="{width: '100%'}" placeholder="请选择创建日期" clearable></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/huasheng/endurance";

export default {
  name: "Post",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        brandName: undefined,
        chipName: undefined,
        phoneType: undefined

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
          brandName: [{
            required: true,
            message: '请输入机型名称',
            trigger: 'blur'
          }],
          chipName: [{
            required: true,
            message: '请输入芯片名称',
            trigger: 'blur'
          }],
          aov: [{
            required: true,
            message: '请输入王者耗电',
            trigger: 'blur'
          }],
          gi: [{
            required: true,
            message: '请输入原神耗电',
            trigger: 'blur'
          }],
          camera: [{
            required: true,
            message: '请输入拍照耗电',
            trigger: 'blur'
          }],
          bilibili: [{
            required: true,
            message: '请输入B站耗电',
            trigger: 'blur'
          }],
          standby: [{
            required: true,
            message: '请输入待机耗电',
            trigger: 'blur'
          }],
          weibo: [{
            required: true,
            message: '请输入微博耗电',
            trigger: 'blur'
          }],
          chicken: [{
            required: true,
            message: '请输入吃鸡耗电',
            trigger: 'blur'
          }],
          residue: [{
            required: true,
            message: '请输入剩余电量',
            trigger: 'blur'
          }],

          createTime: [{
            required: true,
            message: '请选择创建日期',
            trigger: 'change'
          }],
        },
        phoneTypeOptions: [{
          "label": "直板机",
          "value": 1
        }, {
          "label": "折叠屏",
          "value": 2
        }, {
          "label": "平板电脑",
          "value": 3
        }],
    };
  },

  created() {
    this.getList();
  },

  methods: {
    /** 查询续航数据列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        brandName: null,
        chipName: null,
        aov: null,
        gi: null,
        camera: null,
        bilibili: null,
        standby: null,
        weibo: null,
        chicken: null,
        residue: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.postId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPost(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改数据";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids;
      const brandName = row.brandName;
      this.$modal.confirm('是否确认删除' + brandName + '的数据？').then(function() {
        return delPost(postIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

  }

};


</script>
