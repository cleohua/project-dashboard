import floatDialogSlotCompon from "../../../vue/assets/float-dialog-slot-compon.js";

var template =  /*html*/ `
<float-dialog
    ref="dialog"
    :elementID="elementID"
    :titleText="titleText"
    :bottomShow="bottomShow"
    :allowBgClick="allowBgClick"
    :showCloseBtn="showCloseBtn"
    @nextBtnClick="nextBtnClick"
    @closeClick="closeClick"
    @afterLeave="afterLeave"
>
    <template 
        v-slot:default
    >
        <div
            class="search-area"
            v-if="allowSearch"
        >
            <i
                class="fa fa-search"
            ></i>
            <input
                type="text"
                v-model="originText"
                placeholder="搜尋，空格分隔多關鍵字篩選"
            >
        </div>
        <div
            class="select-list-content scroll-style-gray-thick"
            ref="scroll"
        >
            <template 
                v-if="paginated.length"
            >
                <div
                    v-for="item in paginated"
                    :key="item.uid"
                    :class="listClass"
                    @click="listSelect(item.uid)"
                >
                    <slot
                        :item="item"
                        :selectBtnClass="selectBtnClass"
                    >
                        <div
                            :class="selectBtnClass(item.uid)"
                        ></div>
                        <div>{{item.text}}</div>
                    </slot>
                </div>
                <div
                    ref="load"
                    class="loader"
                    v-show="hasNextPage"
                >顯示更多</div>
                <div
                    v-if="allowOtherOption"
                    class="other-option"
                    :class="listClass"
                    @click="listSelect(0)"
                >
                    <div
                        :class="selectBtnClass(0)"
                    ></div>
                    <div>其他</div>
                    <div>
                        <textarea
                            v-model="otherOptionText"
                            :placeholder="otherOptionPlaceholder"
                            @click.stop
                        ></textarea>
                    </div>
                </div>
            </template>
            <div
                v-else-if="searchText.length"
                class="remind-msg"
            >無符合條件</div>
            <div
                v-else
                class="remind-msg"
            >無資料</div>
        </div>
    </template>
    <template
        v-if="customBottom"
        v-slot:bottom="{
            onDialogClose,
            bottomCancelShow,
            setBottomCancelClass,
            closeBtnClick,
            bottomCancelText,
            bottomFinishShow,
            setBottomFinishClass,
            nextBtnClick,
            bottomFinishText
        }"
    >
        <slot 
            name="bottom"
            :dataList="dataList"
            :currentList="currentList"
            :onDialogClose="onDialogClose"
            :bottomCancelShow="bottomCancelShow"
            :setBottomCancelClass="setBottomCancelClass"
            :closeBtnClick="closeBtnClick"
            :bottomCancelText="bottomCancelText"
            :bottomFinishShow="bottomFinishShow"
            :setBottomFinishClass="setBottomFinishClass"
            :nextBtnClick="nextBtnClick"
            :bottomFinishText="bottomFinishText"
        ></slot>
    </template>
</float-dialog>
`

export default {
    name: 'select-dialog-v2-compn',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
    },
    data() {
        return {
            // dialog
            showCloseBtn: false,
            bottomShow: true,
            allowBgClick: true,
            elementID: 'select-dialog-v2-page',
            titleText: '請選擇',
            // this
            originText: '',
            searchText: '',
            dataList: [],
            currentList: [],
            muiltSelect: false,
            observer: null,
            limit: 30,
            // options set
            sureCall: null,
            cancelCall: null,
            allowNonSelect: false,
            allowSearch: true,
            listClass: 'one-list',
            selectClass: '',
            onSelectClass: 'selected',
            allowOtherOption: true,
            otherOptionSelect: false,
            otherOptionText: '',
            otherOptionPlaceholder: '',
            customBottom: false,
        }
    },
    computed: {
        filterList() {
            return this.dataList.filter(target => {
                let keys = this.searchText.toLowerCase().split(' ');
                let text = target?.text?.toLowerCase() || '';
                return !keys.map(k => text.includes(k)).includes(false);
            });
        },
        paginated() {
            return this.filterList.slice(0, this.limit);
        },
        hasNextPage() {
            return this.paginated.length < this.filterList.length;
        },
        selectBtnClass() {
            return (uid) => {
                return {
                    [this.selectClass]: true,
                    [this.onSelectClass]: this.currentList.includes(uid),
                }
            }
        }
    },
    watch: {
        // for debounce
        originText: function (newVal) {
            this.checkSearchStr(newVal);
        },
    },
    methods: {
        listSelect(uid) {
            if (this.muiltSelect) {
                let index = this.currentList.indexOf(uid);
                if (index != -1) {
                    this.currentList.splice(index, 1);
                } else {
                    this.currentList.push(uid);
                }
            } else if (this.currentList?.[0] == uid) {
                this.currentList = [];
            } else {
                this.currentList = [uid];
            }
        },
        async infiniteScroll([{ isIntersecting, target }]) {
            if (isIntersecting) {
                const parent = target.offsetParent;
                const scrollTop = target.offsetParent.scrollTop;
                this.limit += 10;
                await this.$nextTick();
                parent.scrollTop = scrollTop;
            }
        },
        disconnect() {
            this.observer.disconnect();
        },
        checkSearchStr: _.debounce(function (string) {
            this.limit = 30;
            this.$refs.scroll.scrollTop = 0;
            this.searchText = string;
        }, 200),
        nextBtnClick() {
            if (this.allowNonSelect || this.currentList.length) {
                let selectList = this.dataList.filter(item => this.currentList.includes(item.uid));
                if (this.currentList.includes(0)) {
                    selectList.push({ uid: 0, text: this.otherOptionText });
                }

                this.sureCall?.(_.cloneDeep(selectList));
                this.$refs.dialog.onDialogClose();
            } else {
                floatMsgRemind('無選擇任何項目');
            }
        },
        closeClick(type) {
            this.cancelCall?.(type);
        },
        afterLeave: function () {
            this.disconnect();
            this.$destroy();
        },
    },
    created() {
        if (this.hasNextPage) {
            this.$nextTick().then(() => this.observer.observe(this.$refs.load));
        }
    },
    mounted() {
        this.observer = new IntersectionObserver(this.infiniteScroll);
    }
}