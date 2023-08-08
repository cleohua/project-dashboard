import * as callapi from "./callAPI.js";
import edit from "./view/index.js";
import workspace from "./workspace.js";
import statistics from "./statistics.js";
import guideCompon from "./component/guide-compon.js";
import overview from "./view/overview.js";

export default async function init(args) {
    callapi.setArgs(args);
    let _permission = callapi.getPermission();

    let topVue = new Vue({
        el: '#safety-inspect-content',
        components: {
            workspace,
            statistics,
            overview,
        },
        data: function () {
            let option = {
                'workspace': {},
                'statistics': {},
            };
            let userID = args.user_id;
            let isAdmin = args.isAdmin;
            let isProject = args.isProject;
            let currentTab = 'workspace';
            let currentCompon = 'workspace';
            let currentOption = option.workspace;

            return {
                showOverview: false,
                titleText: isProject ? '走動管理' : '安保中心',
                hashInfo: {},
                currentTab,
                currentOption,
                currentCompon,
                userID,
                isProject,
                isAdmin,
                option,
                tabs: [
                    {
                        tab: 'workspace',
                        name: '缺失回覆區',
                        enable: isProject,
                    },
                    {
                        tab: 'workspace',
                        name: '個人工作區',
                        enable: !isProject,
                    },
                    {
                        tab: 'statistics',
                        name: '統計分析',
                        enable: !isProject,
                    },
                    {
                        tab: 'audit',
                        name: '稽核記錄',
                        enable: true,
                    },
                ],
                insertBtnShow: false,
                headerFlipUp: false,
            }
        },
        computed: {
            showTab() {
                return this.tabs.filter(t => t.enable);
            },
        },
        methods: {
            async tabClick(tab = this.currentTab) {
                this.currentOption = this.option[tab];
                this.currentTab = tab;
                this.currentCompon = tab == 'statistics' ? 'statistics' : 'workspace';
                await this.$nextTick();
                this.$refs[tab].refresh?.();
            },
            childEvent(event, ...args) {
                switch (event) {
                    case 'export': {
                        edit.exportReportView(args[0], this.isProject);
                        break;
                    }
                    case 'set':
                        edit.settingPage();
                        break;
                    case 'paperClick':
                        const refreshCall = () => this.tabClick();
                        edit.paperPage(args[0], this.isProject, refreshCall);
                        break;
                    case 'reportClick':
                        let withPaper = this.currentTab == 'workspace' && !this.isProject;
                        this.openToRecord(args[0], withPaper);
                        break;
                    case 'onRecordView':
                        this.recordView(args[0]);
                        break;
                    case 'markClick':
                        break;
                    // for project side
                    case 'userManaClick':
                        edit.userMana();
                        break;
                    case 'flipBtnClick':
                        this.headerFlipUp = !this.headerFlipUp;
                        break;
                }
            },
            // paperID, recordIdArr, supervise
            openToRecord({ paperID, recordIdArr, supervise }, withPaper = false) {
                if (withPaper) {
                    const refreshCall = () => this.tabClick();
                    const onMountedCall = async (paperVue) => {
                        paperVue.tabClick();

                        const closeCall = async (update = false) => {
                            if (update) {
                                paperVue.loading = true;
                                const info = await callapi.getPaperInfo(paperVue.uid);
                                await paperVue.setData(info);
                                await paperVue.tabClick();
                                // 讓列表更新
                                paperVue.pageRefresh = true;
                            }
                            if (paperVue.currentCompon == 'picture-mana') {
                                paperVue.$refs['picture-mana']?.init();
                            }
                        }

                        edit.viewRecord({
                            paperID,
                            recordIdArr,
                            paperInfo: _.cloneDeep(paperVue.paperInfo),
                            isProject: this.isProject,
                            closeCall,
                        });
                    }

                    edit.paperPage(paperID, this.isProject, refreshCall, onMountedCall);
                } else {
                    const closeCall = (update = false) => {
                        const putArea = document.getElementById('fullsize');
                        putArea.classList.remove('active');
                        // 編輯/刪除後列表更新
                        if (update) this.tabClick();
                    }

                    if (this.isProject) {
                        edit.viewRecordForProject({
                            paperID,
                            recordIdArr,
                            isProject: this.isProject,
                            closeCall,
                        });
                    } else {
                        edit.viewRecord({
                            nextBtnShow: supervise == this.userID || this.isAdmin,
                            paperID,
                            recordIdArr,
                            isProject: this.isProject,
                            closeCall,
                        });
                    }
                }
            },
            // 記錄快顯
            recordView(info) {
                edit.viewRecordFloat(info);
            },
            // 新增報告
            insert() {
                edit.editPaperInfo({
                    sureCall: (uid) => {
                        this.tabClick();
                        this.childEvent('paperClick', uid);
                    }
                });
            },
            toSetting() {
                if (this.isProject) {
                    edit.userMana(this.refresh);
                } else {
                    edit.settingPage(this.refresh);
                }
            },
            async refresh() {
                let permission = await callapi.getPermission();
                const { admin, used, checklist } = permission;

                if (used) {
                    document.querySelector('#safety-inspect-content #guide')?.remove();
                    const putArea = document.getElementById('fullsize');
                    putArea.classList.remove('active');
                    if (!this.isProject && !checklist) {
                        edit.emptyChecklistRemind([
                            {
                                text: '前往設定',
                                fnCall: () => this.toSetting(),
                                option: [{
                                    class: 'success-style',
                                    style: '',
                                }]
                            },
                        ],
                            admin
                        );
                    }
                } else {
                    const putArea = document.getElementById('fullsize');
                    putArea.classList.add('active');
                    let vueArea = document.createElement('div');
                    vueArea.setAttribute('id', 'guide');
                    putArea.appendChild(vueArea);
                    const sureCall = this.toSetting;
                    // only first time
                    new Vue({
                        el: '#guide',
                        mixins: [guideCompon],
                        data() {
                            return {
                                editable: admin,
                                opacityValue: admin ? 1 : 0.3,
                                sureCall,
                                isProject: this.isProject,
                            }
                        }
                    });
                }
            },
        },
        async created() {
            if (!this.isProject) this.insertBtnShow = true;
        },
    });

    const { admin, used, checklist } = await _permission;
    if (used) {
        document.querySelector('#safety-inspect-content #guide').remove();
        const putArea = document.getElementById('fullsize');
        putArea.classList.remove('active');

        if (!args.isProject && !checklist) {
            edit.emptyChecklistRemind([
                {
                    text: '前往設定',
                    fnCall: () => topVue.toSetting(),
                    option: [{
                        class: 'success-style',
                        style: '',
                    }]
                },
            ],
                admin
            );
        }
    } else {
        // only first time
        new Vue({
            el: '#guide',
            mixins: [guideCompon],
            data() {
                return {
                    editable: admin,
                    opacityValue: admin ? 1 : 0.3,
                    sureCall: () => topVue.toSetting(),
                    isProject: args.isProject,
                }
            }
        });
    }
}