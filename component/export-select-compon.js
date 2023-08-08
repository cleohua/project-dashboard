import floatDialogSlotCompon from "../../dailyreport/component/float-dialog-slot-compon";

var template = /*html*/ `
<float-dialog
    ref="dialog"
    :elementID="elementID"
    :titleText="titleText"
    :bottomShow="bottomShow"
    :bottomCancelShow="bottomCancelShow"
    :bottomFinishClass="bottomFinishClass"
    :allowBgClick="allowBgClick"
    :showCloseBtn="showCloseBtn"
    @nextBtnClick="nextBtnClick"
>
    <div
        :class="{'loading': loading}"
    >
        <div>
            <div>
                <div>日期</div>
                <div
                    class="range-select"
                >
                    <v-date-picker
                        v-model="date"
                    >
                        <template
                            v-slot="{ inputValue, togglePopover }"
                        >
                            <div
                                class="v-datepicker-area"
                            >
                                <i
                                    class="fa fa-calendar" 
                                    @click="togglePopover()"
                                ></i>
                                <input
                                    :value="inputValue"
                                    readonly
                                />
                            </div>
                        </template>
                    </v-date-picker>
                </div>
            </div>
            <div>
                <div>督導人員</div>
                <div
                    class="supervise-select"
                >
                    <v-select
                        label="name"
                        :options="paginated_1"
                        :filterable="false"
                        v-model="currrentSupervise"
                        @open="vSelectOnOpen(1)"
                        @close="vSelectOnClose(1)"
                        @search="query => supserviseText = query"
                        placeholder="所有督導人員"
                    >
                        <template #list-footer>
                            <li
                                ref="load"
                                class="loader"
                                v-show="load_1"
                            >顯示更多</li>
                        </template>
                        <template #no-options>沒有符合的項目</template>
                    </v-select>
                </div>
            </div>
            <div>
                <div>工地</div>
                <div
                    class="project-select"
                >
                    <v-select
                        label="text"
                        :options="paginated_0"
                        :filterable="false"
                        v-model="currentProjcet"
                        @open="vSelectOnOpen(0)"
                        @close="vSelectOnClose(0)"
                        @search="query => porjectText = query"
                        placeholder="所有工地"
                    >
                        <template #list-footer>
                            <li
                                ref="load"
                                class="loader"
                                v-show="load_0"
                            >顯示更多</li>
                        </template>
                        <template #no-options>沒有符合的項目</template>
                    </v-select>
                </div>
            </div>
        </div>
        <div>
            <div>選擇欲匯出之報告</div>
            <div
                class="scroll-style-gray-thin"
            >
                <template
                    v-if="count"
                >
                    <div
                        v-for="paper in dataList"
                        :key="paper.uid"
                        @click="paperSelect(paper.uid)"
                        class="one-list"
                        :class="{'selected': paper.uid == currentSelect}"
                    >
                        <div>{{paper.title}}</div>
                        <div
                            :class="{'fa fa-check': paper.uid == currentSelect}"
                        ></div>
                    </div>
                    <div    
                        ref="pageload"
                        class="read-more"
                        v-if="showPageLoad"
                    >readmore</div>
                </template>
                <template
                    v-else
                >
                    <div
                        class="remind-msg"
                    >無符合條件報告</div>
                </template>
            </div>
        </div>
    </div>
</float-dialog>
`

export default {
    name: 'export-select-compon',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
        'v-select': VueSelect.VueSelect,
    },
    data() {
        return {
            // dialog
            showCloseBtn: false,
            bottomShow: true,
            allowBgClick: true,
            elementID: 'export-select',
            titleText: '套表設定',
            bottomCancelShow: false,
            bottomFinishClass: ['bottom-finish-btn', 'full-size'],
            // datepicker
            date: new Date(),
            // v-select
            porjectText: '',
            supserviseText: '',
            currentProjcet: null,
            currrentSupervise: null,
            projectList: [],
            superviseList: [],
            limit: 10,
            // content
            count: 0,
            dataList: [],
            partition: 10,
            showPageLoad: true,
            loading: true,
            currentSelect: null,
        }
    },
    computed: {
        // v-select
        filtered_0() {
            return this.projectList.filter(tag => {
                let keys = this.porjectText.toLowerCase().split(' ');
                let tagText = tag.text.toLowerCase();
                let search = !keys.map(k => tagText.includes(k)).includes(false);
                return search;
            });
        },
        filtered_1() {
            return this.superviseList.filter(tag => {
                let keys = this.supserviseText.toLowerCase().split(' ');
                let tagText = tag.name.toLowerCase();
                let search = !keys.map(k => tagText.includes(k)).includes(false);
                return search;
            });
        },
        paginated_0() {
            return this.filtered_0.slice(0, this.limit);
        },
        paginated_1() {
            return this.filtered_1.slice(0, this.limit);
        },
        load_0() {
            return this.paginated_0.length < this.filtered_0.length;
        },
        load_1() {
            return this.paginated_1.length < this.filtered_1.length;
        },
    },
    watch: {
        date() {
            this.refresh();
        },
        currentProjcet() {
            this.refresh();
        },
        currrentSupervise() {
            this.refresh();
        },
    },
    methods: {
        // vselect observer
        async vSelectOnOpen(i) {
            // 0:project, 1: supervise
            let target = i ? this.load_1 : this.load_0;
            if (target) {
                await this.$nextTick();
                this.observer.observe(this.$refs.load);
            }
        },
        vSelectOnClose() {
            this.observer.disconnect();
            this.limit = 10;
        },
        async infiniteScroll([{ isIntersecting, target }]) {
            if (isIntersecting) {
                const ul = target.offsetParent;
                const scrollTop = target.offsetParent.scrollTop;
                this.limit += 10;
                await this.$nextTick();
                ul.scrollTop = scrollTop;
            }
        },
        paperSelect(uid) {
            this.currentSelect = uid;
        },
        async refresh() {
            this.loading = true;
            this.count = 0;
            this.pageObserver?.disconnect();
            this.dataList = [];
            let content = this.$refs.content;
            if (content) content.scrollTop = 0;

            let rsData = await this.getPaperList();
            if (rsData) {
                const { count, list } = rsData;
                this.count = count;
                this.dataList = list;
                let showPageLoad = list.length > 0 && list.length < count;

                this.showPageLoad = showPageLoad;
                await this.$nextTick();
                if (showPageLoad) {
                    this.pageObserver.observe(this.$refs.pageload);
                }
            }
            this.loading = false;
        },
        getPaperList() {
            // 取報告
            let sendData = {
                date: {
                    start: this.date.getTime(),
                    end: this.date.getTime(),
                },
                range: [
                    this.dataList.length + 1,
                    this.dataList.length + this.partition,
                ],
                project: this.currentProjcet?.id,
                supervise: this.currrentSupervise?.uid,
            }

            return this.getData?.(sendData) || false;
        },
        nextBtnClick() {
            if(this.currentSelect) {
                this.sureCall?.(_.cloneDeep({
                    uid: this.currentSelect,
                    date: this.date.getTime(),
                    supervise: this.currrentSupervise?.uid,
                }));
                this.$refs.dialog.onDialogClose();
            } else {
                floatMsgRemind('請選擇欲套表報告');
            }
        }
    },
    created() {
        this.refresh();
    },
    async mounted() {
        this.observer = new IntersectionObserver(this.infiniteScroll);
    },

}