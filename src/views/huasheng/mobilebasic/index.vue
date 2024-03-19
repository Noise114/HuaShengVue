<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="机型名称" prop="modelName">
          <el-input
            v-model="queryParams.modelName"
            placeholder="请输入机型名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发布日期" prop="releaseDate">
          <el-date-picker clearable
            v-model="queryParams.releaseDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="处理器型号" prop="processorModel">
          <el-input
            v-model="queryParams.processorModel"
            placeholder="请输入处理器型号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="电池容量" prop="batteryCapacity">
          <el-input
            v-model="queryParams.batteryCapacity"
            placeholder="请输入电池容量"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="充电功率" prop="chargingPower">
          <el-input
            v-model="queryParams.chargingPower"
            placeholder="请输入充电功率"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
  
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:data:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:data:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:data:remove']"
          >删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="机型id" align="center" prop="modelId"  v-if="false"/>
        <el-table-column label="机型名称" align="center" prop="modelName" width="130"/>
        <el-table-column label="发布日期" align="center" prop="releaseDate" width="110">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.releaseDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理器" align="center" prop="processorModel" />
        <el-table-column label="起售价格" align="center" prop="startingPrice" />
        <el-table-column label="电池容量(mAh)" align="center" prop="batteryCapacity" />
        <el-table-column label="屏幕尺寸(in)" align="center" prop="screenSize" />
        <el-table-column label="机身厚度(mm)" align="center" prop="thickness" />
        <el-table-column label="机身重量(g)" align="center" prop="weight" />
        <el-table-column label="充电功率(w)" align="center" prop="chargingPower" />
        <el-table-column label="测试系统版本" align="center" prop="testVersion" />
        <el-table-column label="备注" align="center" prop="remarks" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:data:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:data:remove']"
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
  
      <!-- 添加或修改【手机数据】对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
          <el-col :span="12">
            <el-form-item label="机型名称" prop="modelName">
             <el-input v-model="form.modelName" placeholder="请输入机型名称" />
           </el-form-item>
          </el-col>
          <el-col :span="12">
          <el-form-item label="发布日期" prop="releaseDate">
            <el-date-picker clearable
              v-model="form.releaseDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择发布日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="处理器型号" prop="processorModel">
            <el-input v-model="form.processorModel" placeholder="请输入处理器型号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="起售价格" prop="startingPrice">
            <el-input v-model="form.startingPrice" placeholder="请输入起售价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="测试版本" prop="testVersion">
            <el-input v-model="form.testVersion" placeholder="请输入测试版本" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电池容量(mAh)" prop="batteryCapacity">
            <el-input v-model="form.batteryCapacity" placeholder="请输入电池容量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="屏幕尺寸(in)" prop="screenSize">
            <el-input v-model="form.screenSize" placeholder="请输入屏幕尺寸" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机身厚度(mm)" prop="thickness">
            <el-input v-model="form.thickness" placeholder="请输入机身厚度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机身重量(g)" prop="weight">
            <el-input v-model="form.weight" placeholder="请输入机身重量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="充电功率(w)" prop="chargingPower">
            <el-input v-model="form.chargingPower" placeholder="请输入充电功率" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { listData, getData, delData, addData, updateData } from "@/api/huasheng/mobilebasic";
  
  export default {
    name: "Data",
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
        // 【手机基础数据】表格数据
        dataList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          modelName: null,
          releaseDate: null,
          processorModel: null,
          batteryCapacity: null,
          chargingPower: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询【手机基础数据】列表 */
      getList() {
        this.loading = true;
        listData(this.queryParams).then(response => {
          this.dataList = response.rows;
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
          modelId: null,
          modelName: null,
          releaseDate: null,
          processorModel: null,
          startingPrice: null,
          testVersion: null,
          batteryCapacity: null,
          screenSize: null,
          thickness: null,
          weight: null,
          chargingPower: null,
          remarks: null,
          creationDate: null,
          updateDate: null
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
        this.ids = selection.map(item => item.modelId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加【手机基础数据】";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const modelId = row.modelId || this.ids
        getData(modelId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改【手机基础数据】";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.modelId != null) {
              updateData(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addData(this.form).then(response => {
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
        const modelIds = row.modelId || this.ids;
        this.$modal.confirm('是否确认删除【手机数据】编号为"' + modelIds + '"的数据项？').then(function() {
          return delData(modelIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/data/export', {
          ...this.queryParams
        }, `data_${new Date().getTime()}.xlsx`)
      }
    }
  };
  </script>
  