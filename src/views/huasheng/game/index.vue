<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="机型名称" prop="modelName">
          <el-input
            v-model="queryParams.modelName"
            placeholder="请输入机型名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="游戏名称" prop="gameName">
          <el-select v-model="queryParams.gameName" placeholder="请输入游戏名称" clearable  @keyup.enter.native="handleQuery">
             <el-option v-for="item in gameOptions" 
               :key="item.gameId" 
               :label="item.gameName" 
               :value="item.gameName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="帧率" prop="frameRate">
          <el-input
            v-model="queryParams.frameRate"
            placeholder="请输入帧率"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="功耗" prop="powerConsumption">
          <el-input
            v-model="queryParams.powerConsumption"
            placeholder="请输入功耗"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="正面温度" prop="temperatureFront">
          <el-input
            v-model="queryParams.temperatureFront"
            placeholder="请输入正面温度"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="侧面温度" prop="temperatureSide">
          <el-input
            v-model="queryParams.temperatureSide"
            placeholder="请输入侧面温度"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="背面温度" prop="temperatureBack">
          <el-input
            v-model="queryParams.temperatureBack"
            placeholder="请输入背面温度"
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
            v-hasPermi="['huasheng:data:add']"
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
            v-hasPermi="['huasheng:data:edit']"
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
            v-hasPermi="['huasheng:data:remove']"
          >删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="false"/>
        <el-table-column label="机型名称" align="center" prop="modelName" />
        <el-table-column label="游戏名称" align="center" prop="gameName" />
        <el-table-column label="游戏帧率" align="center" prop="frameRate" />
        <el-table-column label="游戏功耗" align="center" prop="powerConsumption" />
        <el-table-column label="正面温度" align="center" prop="temperatureFront" />
        <el-table-column label="侧面温度" align="center" prop="temperatureSide" />
        <el-table-column label="背面温度" align="center" prop="temperatureBack" />
        <el-table-column label="创建日期" align="center" prop="creationDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.creationDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新日期" align="center" prop="updateDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['huasheng:data:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['huasheng:data:remove']"
            >删除</el-button>
            <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
            v-hasPermi="['huasheng:data:query']"
          >详细</el-button>         
          <el-button
            type="text"
            size="small"
            icon="el-icon-download"
            @click="handleDownLoad(scope.row)"
            v-hasPermi="['huasheng:data:query']"
          >图片下载</el-button>
       
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
  
      <!-- 添加或修改游戏性能对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
        <el-col :span="12">
          <el-form-item label="手机型号" prop="selectedModel">
          <el-select  
          v-model="form.selectedModel" 
          filterable 
          remote 
          clearable 
          placeholder="请选择手机型号" 
          :remote-method="remoteMethod"
          :loading="loading"
          :disabled="isDisabled"
          >
          <el-option
               v-for="item in modelOptions"
              :key="item.modelId"
              :label="item.modelName"
              :value="item.modelId">
          </el-option>
        </el-select>
        </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="游戏名称" prop="selectedGame">
          <el-select  
          v-model="form.selectedGame" 
          filterable 
          remote 
          clearable 
          placeholder="请选择手机型号" 
          :remote-method="remoteGame"
          :loading="loading"
          :disabled="isDisabled "
           >
          <el-option
               v-for="item in gameOptions"
              :key="item.gameId"
              :label="item.gameName"
              :value="item.gameId">
          </el-option>
        </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏帧率" prop="frameRate">
            <el-input v-model="form.frameRate" type="number" placeholder="请输入帧率" :disabled="isDisabled && shouldDisable1" clearable style="width: 225px ;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游戏功耗" prop="powerConsumption">
            <el-input v-model="form.powerConsumption" type="number"  placeholder="请输入功耗" :disabled="isDisabled && shouldDisable2" clearable style="width: 225px ;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="正面温度" prop="temperatureFront">
            <el-input v-model="form.temperatureFront" type="number" placeholder="请输入正面温度" :disabled="isDisabled && shouldDisable3" clearable style="width: 225px ;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
         <el-form-item label="侧面温度" prop="temperatureSide">
            <el-input v-model="form.temperatureSide" type="number" placeholder="请输入侧面温度" :disabled="isDisabled && shouldDisable4" clearable style="width: 225px ;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="背面温度" prop="temperatureBack">
            <el-input v-model="form.temperatureBack" type="number" placeholder="请输入背面温度" :disabled="isDisabled && shouldDisable5" clearable style="width: 225px ;"/>
          </el-form-item>  
        </el-col>
        <el-col :span="12">
         <el-form-item label="帧率图片" prop="frameRateImageUrl">
          <image-upload v-model="form.frameRateImageUrl" :disabled="isDisabled" clearable/>
         </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="功耗图片" prop="powerConsumptionImageUrl">
           <image-upload v-model="form.powerConsumptionImageUrl" :disabled="isDisabled" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="温度正面图片" prop="temperatureFrontImageUrl">
          <image-upload v-model="form.temperatureFrontImageUrl" :disabled="isDisabled" clearable/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="温度侧面图片" prop="temperatureSideImageUrl">
          <image-upload v-model="form.temperatureSideImageUrl" :disabled="isDisabled" clearable/>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="温度背面图片" prop="temperatureBackImageUrl">
          <image-upload v-model="form.temperatureBackImageUrl" :disabled="isDisabled" clearable/>
        </el-form-item>
        </el-col>                
        </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-show="isEditing" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { listData, getData, delData, addData, updateData ,uploadImage,download} from "@/api/huasheng/game";
  import { queryMoblie,queryGame } from "@/api/huasheng/common";
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
        // 游戏性能表格数据
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
          gameName: null,
          frameRate: null,
          powerConsumption: null,
          frameRateImageUrl: null,
          temperatureFront: null,
          temperatureSide: null,
          temperatureBack: null,
          powerConsumptionImageUrl: null,
          temperatureFrontImageUrl: null,
          temperatureSideImageUrl: null,
          temperatureBackImageUrl: null,
          creationDate: null,
          updateDate: null
        },
        // 表单参数
        form: {
          selectedModel: null,
          selectedGame: null,
          modelId:null
        },
        // 表单校验
        rules: {
          selectedModel: [
          { required: true, message: "手机型号不能为空", trigger: "blur" }
        ],
        selectedGame: [
          { required: true, message: "游戏名称不能为空", trigger: "blur" }
        ]
        },
        //机型选择器
        selectedModel:'',
        modelOptions :[],
        //游戏选择器
        selectedGame:'',
        gameOptions:[],
        isEditing: false,
        isDisabled: false,
        shouldDisable1: true, // 控制属性1是否禁用  
        shouldDisable2: true, // 控制属性1是否禁用  
        shouldDisable3: true, // 控制属性1是否禁用  
        shouldDisable4: true, // 控制属性1是否禁用  
        shouldDisable5: true, // 控制属性1是否禁用  
      };
    },
    created() {
      this.getList();
      this.remoteMethod();
      this.remoteGame();
    }, 
    methods: {    
    
    /** 获取手机列表下拉框 */
      remoteMethod(query){
        this.loading= true;
         queryMoblie(query)
        .then(response=>{
         this.modelOptions=response.data;
         this.loading=false;
       })
       .catch(error=>{
          console.error('Error fetching mobile info',error);
          this.loading=false;
        }); 
      },

      /** 获取游戏列表下拉框 */
      remoteGame(query){
        this.loading= true;
         queryGame(query)
        .then(response=>{
         this.gameOptions=response.data;
         this.loading=false;
       })
       .catch(error=>{
          console.error('Error fetching game info',error);
          this.loading=false;
        });       
      },

    /** 查询游戏性能列表 */
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
          id: null,
          modelId: null,
          gameId: null,
          frameRate: null,
          powerConsumption: null,
          frameRateImageUrl: null,
          temperatureFront: null,
          temperatureSide: null,
          temperatureBack: null,
          powerConsumptionImageUrl: null,
          temperatureFrontImageUrl: null,
          temperatureSideImageUrl: null,
          temperatureBackImageUrl: null,
          creationDate: null,
          updateDate: null,
          gameName:null,
          modelName:null
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
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.selectedModel=null;
        this.selectedGame=null;
        this.open = true;
        this.isEditing=true;
        this.isDisabled=false;
        this.shouldDisable1=false; // 控制属性1是否禁用  
        this.shouldDisable2=false; // 控制属性1是否禁用  
        this.shouldDisable3=false; // 控制属性1是否禁用  
        this.shouldDisable4=false; // 控制属性1是否禁用  
        this.shouldDisable5=false;// 控制属性1是否禁用 
        this.title = "添加游戏性能";
       
      },

      handleDownLoad(row){
        let formData = { 
            frameRateImageUrl: row.frameRateImageUrl,
            powerConsumptionImageUrl: row.powerConsumptionImageUrl,
            temperatureFrontImageUrl: row.temperatureFrontImageUrl,
            temperatureSideImageUrl: row.temperatureSideImageUrl,
            temperatureBackImageUrl: row.temperatureBackImageUrl
        };
        download(formData).then(blob => {  
    // 可以在这里检查blob.type是否为'application/zip'（如果服务器返回正确的MIME类型）  
      
    const link = document.createElement('a');  
    const url = window.URL.createObjectURL(blob); // 创建blob的URL  
    const name=row.modelName;
    const gname=row.gameName;
    link.href = url;  
    link.download = name+'_'+gname+'.zip'; // 设置下载文件名  
    document.body.appendChild(link);  
    link.click(); // 模拟点击触发下载  
    document.body.removeChild(link); // 下载后移除元素  
    window.URL.revokeObjectURL(url); // 正确释放URL对象  
  }).catch(error => {  
    console.error('下载出错：', error);  
    // 在这里添加用户反馈，比如显示错误消息  
  });  
      },


      /** 修改按钮操作 */
      handleUpdate(row) {
        const id = row.id || this.ids
        getData(id).then(response => {
          this.form = response.data;
          this.form.selectedModel=this.form.modelId;
          this.form.selectedGame=this.form.gameId;
          this.open = true;
          this.isEditing=true;
          this.isDisabled=true;
          this.shouldDisable1=false;
          this.shouldDisable2=false;
          this.shouldDisable3=false;
          this.shouldDisable4=false;
          this.shouldDisable5=false;
          this.title = "修改游戏性能";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            let formData = {  
            modelId:this.form.selectedModel, // 将选中的 modelId 包含进来  
            gameId:this.form.selectedGame, 
            frameRate: this.form.frameRate,
            powerConsumption: this.form.powerConsumption,
            frameRateImageUrl: this.form.frameRateImageUrl,
            temperatureFront: this.form.temperatureFront,
            temperatureSide: this.form.temperatureSide,
            temperatureBack: this.form.temperatureBack,
            powerConsumptionImageUrl: this.form.powerConsumptionImageUrl,
            temperatureFrontImageUrl: this.form.temperatureFrontImageUrl,
            temperatureSideImageUrl: this.form.temperatureSideImageUrl,
            temperatureBackImageUrl: this.form.temperatureBackImageUrl,
            }; 
            if (this.form.id != null) {
              updateData(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addData(formData).then(response => {
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
        const ids = row.id || this.ids;
        const phoneName=row.modelName;
        const gmName=row.gameName;
        this.$modal.confirm('是否确认删除' +phoneName +"的"+ gmName + '的数据项？').then(function() {
          return delData(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
       /** 详细按钮操作 */
    handleView(row) {
      this.form = row;
      this.form.selectedModel=this.form.modelId;
      this.form.selectedGame=this.form.gameId;
      this.open = true;
      this.isEditing=false;
      this.isDisabled=true;
      this.shouldDisable1=true; // 控制属性1是否禁用  
      this.shouldDisable2=true; // 控制属性1是否禁用  
      this.shouldDisable3=true; // 控制属性1是否禁用  
      this.shouldDisable4=true; // 控制属性1是否禁用  
      this.shouldDisable5=true;// 控制属性1是否禁用  
      this.title = "游戏性能详情";
    },


    }
  };
  </script>
  