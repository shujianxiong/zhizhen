<!-- 角色管理 -->
<template>
    <div class="rolesbox">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="white" text-color="#f999" active-text-color="rgb(18,42,136)">
            <el-menu-item index="1">角色管理</el-menu-item>
        </el-menu>

        <div class="rolesmain">
            <div class="rolesfind">
                <el-form :inline="true" :model="formInline" class="demo-form-inline" size='small'
                    style="margin-left: 10px;">
                    <el-form-item>
                        <el-input v-model="formInline.user" placeholder="请输入角色"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="background-color: rgb(54,116,255); color: white;" icon="el-icon-search"
                            @click='getRoleList'>查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="rolesdata">
                <el-row style="margin-bottom: 12px;">
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="addVisible=true">添加</el-button>
                    <el-button size="small" class="delete" icon="el-icon-close" @click='outVisible = true'>删除
                    </el-button>
                </el-row>

                <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark"
                    style="margin-bottom: 15px;" class="table" :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="80">
                    </el-table-column>
                    <el-table-column label="id" width="80">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>

                    <el-table-column prop="roleName" label="角色管理">
                    </el-table-column>
                    <el-table-column prop="intro" label="角色描述">
                    </el-table-column>
                    <el-table-column label="操作" width="245">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page" style="display: flex;">
                    <div class="grid-content bg-purple-light" style="margin-left: auto;">
                        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="pageNum" :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%" class="editbox">
            <div class="information">
                <div style="width: 80%; margin: 0 auto; ">
                    <el-form :model="addForm"  ref="addForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="角色名称" required>
                            <el-input v-model="addForm.rolesname" placeholder="请输入角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述" >
                            <el-input v-model="addForm.intro" placeholder="请输入角色描述"></el-input>
                        </el-form-item>
                        <el-form-item label="权限设置" required>
                            <el-tree :data="addData" show-checkbox default-expand-all node-key="menu_id" ref="tree"
                                highlight-current :props="addProps" @check='getCheckedKeys'>
                            </el-tree>
                        </el-form-item>
                        <el-form-item style="margin-left: 25px;  margin-top: 50px;">
                            <el-button type="primary" @click="addRole()">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%" class="editbox">
            <div class="information">
                <div style="width: 80%; margin: 0 auto; ">
                    <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="角色名称" required>
                            <el-input v-model="ruleForm.rolesname" placeholder="请输入角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色描述">
                            <el-input v-model="ruleForm.intro" placeholder="请输入角色描述"></el-input>
                        </el-form-item>
                        <el-form-item label="权限设置" required>
                            <el-tree :data="addData" show-checkbox default-expand-all node-key="menu_id" ref="tree"
                                highlight-current :props="addProps" :default-checked-keys='defaultrole'
                                @check='getCheckedKeys'>
                            </el-tree>
                        </el-form-item>

                        <el-form-item style="margin-left: 25px; margin-top: 50px;">
                            <el-button type="primary" @click="updateRole()">确定</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="删除" :visible.sync="outVisible" width="30%" :before-close="handleClose">
            <span>确认删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="outVisible = false">取 消</el-button>
                <el-button type="primary" @click="getdelRole()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                token: localStorage.getItem('token'),
                nemberName: localStorage.getItem('nemberName'),
                roleName: localStorage.getItem('roleName'),
                activeIndex2: '1',
                pagetotal: 0,
                pageSize: 10,
                pageNum: 1,
                formInline: {
                    user: ''
                },
                outVisible: false,
                tableData: [],
                currentPage: 1,
                editVisible: false,
                addVisible: false,

                ruleForm: {
                    rolesname: '',
                    intro: '',
                    roles: ''
                },
                rules: {
                    rolesname: [
                        { required: true, },
                    ],
                    roles: [
                        { required: true, },
                    ]
                },
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },


                addForm: {
                    rolesname: '',
                    intro: ''
                },
                addrules: {
                    rolesname: [
                        { required: true, message: '请输入角色名称', trigger: 'change' },
                    ]
                },
                addData: [],
                addProps: {
                    children: 'sub_menu',
                    label: 'menu_name'
                },
                rolePermissionIds: [],
                roleIds: [],
                defaultrole: [],




                // 编辑
                edit: {
                    roleId: '',
                    roleName: '',
                    intro:''
                },

            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
                this.outVisible = false
            },
            getRowClass({ rowIndex }) {
                if (rowIndex == 0) {
                    return 'background:RGB(242,242,242)'
                } else {
                    return ''
                }
            },
            submitbtn() {
                this.editVisible = false
            },
            // 分页
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getRoleList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.pageNum = val
                this.getRoleList()
            },

            // 管理员列表
            getRoleList() {
                this.$api.post({
                    path: '/manage/getRoleList',
                    params: {
                        token: this.token,
                        roleName: this.formInline.user,
                        pageSize :this.pageSize,
                        pageNum:this.pageNum
                    },
                    success: (data) => {
                        console.log(data)
                        this.tableData = data.data.list
                        this.pagetotal = data.data.total
                    }
                })
            },

            

            // 权限
            rolePermissionsList() {
                this.$api.post({
                    path: '/manage/rolePermissionsList',
                    params: {
                        token: this.token,
                    },
                    success: (data) => {
                        console.log(data)
                        this.addData = data.data
                    }
                })
            },

            // 获取权限id
            getCheckedKeys() {
                console.log(this.$refs.tree.getCheckedKeys());
                this.rolePermissionIds = this.$refs.tree.getCheckedKeys()
            },

            // 添加角色
            addRole() {
                if (this.addForm.rolesname == '') {
                    this.$message({
                        message: '请输入角色名称',
                        type: 'warning'
                    });
                } else if (this.rolePermissionIds.join(",") == '') {
                    this.$message({
                        message: '请选择权限',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/addRole',
                        params: {
                            token: this.token,
                            roleName: this.addForm.rolesname,
                            intro: this.addForm.intro,
                            rolePermissionIds: this.rolePermissionIds.join(",")
                        },
                        success: (data) => {
                            console.log(data)
                            // this.addData = data.data
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.getRoleList()
                                this.addVisible = false
                                this.addForm.rolesname = []
                                this.addForm.intro = ''
                                // this.rolePermissionIds = []
                                this.$refs.tree.setCheckedKeys([]);
                            }
                            else if (data.code == -1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                });
                            }

                        }
                    })
                }
            },

            // 获取角色id
            handleSelectionChange(val) {
                this.multipleSelection = val;
                console.log(val)
                let ids = []
                val.forEach(e => {
                    ids.push(e.roleId)
                });
                this.roleIds = ids
                console.log(ids)
            },
            // 删除角色
            getdelRole() {
                if (this.roleIds.length == 0) {
                    this.$message({
                        message: '请选择要删除的角色',
                        type: 'warning'
                    });
                } else {
                    this.$api.post({
                        path: '/manage/delRole',
                        params: {
                            token: this.token,
                            roleIds: this.roleIds.join(",")
                        },
                        success: (data) => {
                            console.log(data)
                            // this.addData = data.data
                            if (data.code == 1) {
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.getRoleList()
                                this.outVisible = false
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }

                        }
                    })
                }
            },

            // 编辑
            handleEdit(index, row) {
                console.log(index, row);
                this.editVisible = true
                this.defaultrole = row.menuIds
                this.edit.roleId = row.roleId
                this.ruleForm.rolesname = row.roleName
                this.ruleForm.intro = row.intro
                console.log(this.defaultrole);
            },

            updateRole() {
                var arr3 = this.defaultrole.concat(this.roleIds);
                this.$api.post({
                    path: '/manage/updateRole',
                    params: {
                        token: this.token,
                        roleId: this.edit.roleId,
                        roleName: this.ruleForm.rolesname,
                        intro : this.ruleForm.intro,
                        rolePermissionIds: arr3.join(",")
                    },
                    success: (data) => {
                        console.log(data)
                        // this.addData = data.data
                        if (data.code == 1) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getRoleList()
                            this.roleIds = []
                            this.editVisible=false
                        }

                    }
                })
            }
        },
        mounted() {
            this.getRoleList()
            this.rolePermissionsList()
        }
    }
</script>

<style>
    * {
        padding: 0;
        margin: 0;
    }

    .rolesbox {
        width: 100%;
        height: 100%;
    }

    .rolesmain {
        /* width: 98%;
        height: 80%; */
        padding: 10px 10px 0px 10px;

    }

    .rolesfind {
        width: 100%;

        padding-top: 10px;
        background-color: white;
        margin-bottom: 10px;
    }

    .rolesfind .el-form-item__content {
        width: 160px;
    }

    .rolesdata {
        /* width: 98%;
        height: 100%; */
        padding: 10px 20px;
        background-color: white;

    }

    .rolesdata .recovery {
        background-color: rgb(48, 216, 192);
        color: white;
        border: 0px;
    }

    .rolesdata .disable {
        background-color: rgb(255, 102, 0);
        color: white;
        border: 0px;
    }

    .rolesdata .delete {
        background-color: rgb(234, 74, 92);
        color: white;
        border: 0px;
    }

    .el-table th,
    td {
        text-align: center !important;
    }


    /* 编辑 */
    .information {
        width: 100%;
        /* height: 300px; */
        /* margin-top: 20px; */
    }

    .information>div {
        width: 60%;
        margin: 0 auto;
    }

    .editbox .el-dialog__body {
        padding-top: 20px;
        padding-bottom: 100px;
        border-top: 1px solid #ccc;
    }

    .editbox .el-dialog__title {
        font-size: 14px;
    }

    .editbox .el-input__inner {
        width: 72%;
    }

    .select .el-input__inner {
        width: 103%;
    }
</style>