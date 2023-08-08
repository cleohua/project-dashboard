export default /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :showCloseBtn="showCloseBtn"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <div
        class="company-response"
        :class="{'loading': loading}"
    >
        <div
            class="aduit-result"
        >
            <div>審核結果</div>
            <div>
                <div
                    class="result-choice"
                    v-for="(text, index) in auditResult"
                    :key="index"
                    @click="resultTabClick(index)" 
                >
                    <div
                        :class="{'active': currentResultTab == index}"
                    >
                        <i 
                            v-if="currentResultTab == index"
                            class="fa fa-check" aria-hidden="true"
                        ></i>
                    </div>
                    <div>{{text}}</div>
                </div>
            </div>
        </div>
        <div
            class="score-select"
            v-show="checkitemType"
        >
            <div>回覆內容</div>
            <v-select
                label="name"
                :options="scoreTab"
                v-model="currentScoreTab"
                placeholder="請選擇"
            >
            </v-select>
        </div>
        <div 
            class="form-textarea"
        >
            <div>備註說明</div>
            <div
                class="text-area"
            >
                <textarea
                    v-model= "noteText"
                    placeholder="請輸入說明內容"
                    class="scroll-style-gray-thin"
                ></textarea>
            </div>
        </div>
        <div
            class="remind-text"
            v-show="!currentResultTab"
        >*結案後將無法再編輯內容*</div>
    </div>
</float-dialog>
`