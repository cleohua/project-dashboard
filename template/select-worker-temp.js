export default /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :showCloseBtn="showCloseBtn"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <div>
        <div>
            <div>
                <div>選擇廠商</div>
                <div>
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <input
                        type="text"
                        v-model.trim="companyText"
                        placeholder="搜尋廠商"
                    >
                </div>
            </div>
            <div
                class="scroll-style-gray-thick"
                ref="cScroll"
            >
                <div
                    v-for="item in currentCompanyList"
                    :key="item.uid"
                    class="select-item"
                    :class="{'selected': item.uid == company?.uid}"
                    @click="companyClick(item)"
                >{{item.name}}</div>
                <div
                    v-if="companyList.length && !currentCompanyList.length"
                    class="empty-remind"
                >無符合項目</div>
                <div
                    v-if="!companyList.length"
                    class="empty-remind"
                >無可選廠商</div>
            </div>
        </div>
        <div>
            <div>
                <div>選擇工種</div>
                <div>
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <input
                        type="text"
                        v-model.trim="workText"
                        placeholder="搜尋工種"
                    >
                </div>
            </div>
            <div
                class="scroll-style-gray-thick"
                ref="wScroll"
            >
                <div
                    v-for="item in currentWorkList"
                    :key="item.uid"
                    class="select-item"
                    :class="{'selected': item.uid == work?.uid}"
                    @click="workClick(item)"
                >{{item.name}}</div>
                <div
                    v-if="workList.length && !currentWorkList.length"
                    class="empty-remind"
                >無符合項目</div>
                <div
                    v-if="!workList.length"
                    class="empty-remind"
                >無可選工種</div>
            </div>
        </div>
    </div>
</float-dialog>
`